import os
import stripe
from rest_framework import status
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from account.models import StripeModel, OrderModel
from rest_framework.decorators import permission_classes
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# stripe secret test key
stripe.api_key = os.getenv("stripe_key")

def save_card_in_db(cardData, email, cardId, customer_id, user):
    # save card in django stripe model, store only last 4 digits of card number
    StripeModel.objects.create(
        email=email,
        customer_id=customer_id,
        card_number=cardData["number"][-4:],  # store only last 4 digits
        exp_month=cardData["exp_month"],
        exp_year=cardData["exp_year"],
        card_id=cardId,
        user=user,
    )


# Just for testing
class TestStripeImplementation(APIView):
    def post(self, request):
        test_payment_process = stripe.PaymentIntent.create(
            amount=500,
            currency="inr",
            payment_method_types=["card"],
            receipt_email="pranoti17501@gmail.com",
        )
        return Response(data=test_payment_process, status=status.HTTP_200_OK)


# check token expired or not
class CheckTokenValidation(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response("Token is Valid", status=status.HTTP_200_OK)


# to create card token (to validate your card)
class CreateCardTokenView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        print("🔍 DEBUG: Headers received:", dict(request.headers))
        print("🔍 DEBUG: Data received:", request.data)
        
        data = request.data
        email = data.get("email")
        cardStatus = data.get("save_card")
        payment_method_id = data.get("payment_method_id")

        # Validate required fields
        if not email:
            print("❌ ERROR: Email is missing")
            return Response(
                {"detail": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not payment_method_id:
            print("❌ ERROR: Payment method ID is missing")
            return Response(
                {"detail": "Payment method ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        print("✅ DEBUG: All required fields present")
        
        # checking for valid user (email associated with card will be checked)
        customer_data = stripe.Customer.list(email=email).data

        if len(customer_data) == 0:
            # create customer in stripe (will provide us customer id in response)
            customer = stripe.Customer.create(
                email=email,
                description="My new customer",
            )
        else:
            customer = customer_data[0]

        # Attach payment method to customer
        try:
            stripe.PaymentMethod.attach(
                payment_method_id,
                customer=customer.id,
            )
        except stripe.error.CardError as e:
            print(f"❌ Stripe Card Error: {e.user_message}")
            return Response({"detail": e.user_message}, status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.APIConnectionError:
            print("❌ Stripe Connection Error")
            return Response(
                {"detail": "Network error, Failed to establish a new connection."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            print(f"❌ Unexpected Stripe Error: {str(e)}")
            return Response(
                {"detail": f"Stripe error: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Set default payment method for customer invoice payments
        stripe.Customer.modify(
            customer.id,
            invoice_settings={"default_payment_method": payment_method_id},
        )

        if cardStatus:
            try:
                # Get payment method details to save card info
                payment_method = stripe.PaymentMethod.retrieve(payment_method_id)
                card_data = {
                    "number": payment_method.card.last4,
                    "exp_month": payment_method.card.exp_month,
                    "exp_year": payment_method.card.exp_year,
                    "cvc": ""  # CVC is not stored
                }
                save_card_in_db(card_data, email, payment_method_id, customer.id, request.user)
                message = {
                    "customer_id": customer.id,
                    "email": email,
                    "card_data": payment_method,
                }
                print("✅ Card saved successfully")
                return Response(message, status=status.HTTP_200_OK)
            except Exception as e:
                print(f"❌ Error saving card: {str(e)}")
                return Response(
                    {
                        "detail": f"Error saving card: {str(e)}"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            try:
                message = {
                    "customer_id": customer.id,
                    "email": email,
                    "card_data": stripe.PaymentMethod.retrieve(payment_method_id),
                }
                print("✅ Card validated successfully (not saved)")
                return Response(message, status=status.HTTP_200_OK)
            except Exception as e:
                print(f"❌ Network Error: {str(e)}")
                return Response(
                    {"detail": f"Network Error: {str(e)}"}
                )


# Charge the customer card
class ChargeCustomerView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            email = data["email"]
            customer_data = stripe.Customer.list(email=email).data
            if not customer_data:
                return Response(
                    {"detail": "Customer not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            customer = customer_data[0]

            # Create PaymentIntent and confirm it
            payment_intent = stripe.PaymentIntent.create(
                amount=int(float(data["amount"]) * 100),
                currency="inr",
                customer=customer.id,
                payment_method=data.get("payment_method_id"),
                off_session=True,
                confirm=True,
                description="Software development services",
            )

            # saving order in django database
            new_order = OrderModel.objects.create(
                name=data["name"],
                card_number=data["card_number"][-4:],  # store only last 4 digits
                address=data["address"],
                ordered_item=data["ordered_item"],
                paid_status=True,
                paid_at=datetime.now(),
                total_price=data["total_price"],
                is_delivered=data["is_delivered"],
                delivered_at=data["delivered_at"],
                user=request.user,
            )

            return Response(
                data={
                    "data": {
                        "customer_id": customer.id,
                        "message": "Payment Successful",
                        "payment_intent": payment_intent.id,
                    }
                },
                status=status.HTTP_200_OK,
            )

        except stripe.error.CardError as e:
            return Response(
                {"detail": e.user_message}, status=status.HTTP_400_BAD_REQUEST
            )
        except stripe.error.APIConnectionError:
            return Response(
                {"detail": "Network error, Failed to establish a new connection."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# retrieve card (to get user card details)
class RetrieveCardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, customer_id=None, card_id=None):
        if not customer_id or not card_id:
            return Response(
                {"detail": "Customer ID and Card ID are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            card_details = stripe.PaymentMethod.retrieve(card_id)
            return Response(card_details, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"detail": f"Error retrieving card details: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# update a card
class CardUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        try:
            update_card = stripe.PaymentMethod.modify(
                data["card_id"],
                card={
                    "exp_month": data.get("exp_month"),
                    "exp_year": data.get("exp_year"),
                    "name": data.get("name_on_card"),
                    "address_city": data.get("address_city"),
                    "address_country": data.get("address_country"),
                    "address_state": data.get("address_state"),
                    "address_zip": data.get("address_zip"),
                },
            )
        except Exception as e:
            return Response(
                {"detail": f"Error updating card: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # locating stripe object in django database
        try:
            obj = StripeModel.objects.get(card_number=data["card_number"][-4:])
        except StripeModel.DoesNotExist:
            obj = None

        # updating stripe object in django database
        if obj:
            obj.name_on_card = data.get("name_on_card", obj.name_on_card)
            obj.exp_month = data.get("exp_month", obj.exp_month)
            obj.exp_year = data.get("exp_year", obj.exp_year)
            obj.address_city = data.get("address_city", obj.address_city)
            obj.address_country = data.get("address_country", obj.address_country)
            obj.address_state = data.get("address_state", obj.address_state)
            obj.address_zip = data.get("address_zip", obj.address_zip)
            obj.save()

        return Response(
            {
                "detail": "Card updated successfully",
                "data": {"Updated Card": update_card},
            },
            status=status.HTTP_200_OK,
        )


# delete card
class DeleteCardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        try:
            obj_card = StripeModel.objects.get(card_number=data["card_number"][-4:])
        except StripeModel.DoesNotExist:
            return Response(
                {"detail": "Card not found in database."},
                status=status.HTTP_404_NOT_FOUND,
            )

        customerId = obj_card.customer_id
        cardId = obj_card.card_id

        # deleting card from stripe
        try:
            stripe.PaymentMethod.detach(cardId)
        except Exception as e:
            return Response(
                {"detail": f"Error deleting card from Stripe: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # deleting card from django database
        obj_card.delete()

        # delete the customer
        # as deleting the card will not change the default card number on stripe therefore
        # we need to delete the customer (with a new card request customer will be recreated)
        try:
            stripe.Customer.delete(customerId)
        except Exception as e:
            return Response(
                {"detail": f"Error deleting customer from Stripe: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response("Card deleted successfully.", status=status.HTTP_200_OK)