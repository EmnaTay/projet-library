import json

from django.http.response import HttpResponse
from users.serializers import UserSerializer, UserListSerializer
from django.utils import timezone
from django.http import JsonResponse
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from rest_framework.generics import ListAPIView
import json
import qrcode
from io import BytesIO
from django.http.response import HttpResponse
from django.contrib.auth import login
from django.conf import settings
from .models import CustomUser
from .serializers import UserSerializer
from django.contrib.auth import login
from django.http import JsonResponse
from .models import CustomUser

from books.models import Contract, ContractUpdater


def update_contracts():
    """
    check currently active and waiting contract and update it statuses if its already expired
    """
    updater = ContractUpdater.objects.first()
    if updater and updater.timestamp == timezone.now().date():
        return

    updater = ContractUpdater.objects.create()
    contract_late = Contract.objects.filter(expiry__lte=timezone.now(), status="active")
    if contract_late.count():
        updater.contracts.add(*contract_late)
        contract_late.update(status="late")
        for contract in contract_late:
            contract.save()

    contract_expired = Contract.objects.filter(
        expiry__lte=timezone.now(), status="waiting"
    )
    if contract_expired.count():
        updater.contracts.add(*contract_expired)
        contract_expired.update(status="expired")
        for contract in contract_expired:
            contract.save()

    updater.save()


# Create your views here.


def get_current_user(request):
    # Check if the user is authenticated
    if request.user.is_authenticated:
        context = UserSerializer(request.user).data
    else:
        # Handle the case where the user is not authenticated (anonymous user)
        context = {
            "id": None,
            "full_name": "Guest",  # Provide a default value
            "email": None,
            "major": None,
            "year": None,
            "is_staff": False,
            "is_authenticated": False,
            "contracts": [],
        }

    # If the user is staff, update contracts
    if request.user.is_staff:
        update_contracts()

    return JsonResponse(context)


def user_login(request):
    data = json.loads(request.body)
    user = authenticate(**data)
    if user:
        login(request, user)
        context = UserSerializer(user).data

        return JsonResponse(context, status=200)

    return HttpResponse(status=400)


def qr_login(request):
    if request.method != "POST":
        return HttpResponse(status=400)

    data = json.loads(request.body)
    qr_data = data.get("qr_data")  # Expecting the parsed QR content

    try:
        user_id, email, full_name = qr_data.split(":")
        user = CustomUser.objects.get(id=user_id, email=email, full_name=full_name)
        login(request, user)
        return JsonResponse(UserSerializer(user).data, status=200)
    except (CustomUser.DoesNotExist, ValueError):
        return HttpResponse("Invalid QR code", status=400)


def user_register(request):
    if request.method != "POST" or request.user.is_authenticated:
        return HttpResponse(status=400)

    data = json.loads(request.body)
    email = data.get("email")
    password = data.get("password")
    full_name = data.get("full_name")
    major = data.get("major")
    year = data.get("year")

    if not email.endswith("@ihec.ucar.tn"):
        return HttpResponse("Invalid email domain", status=400)

    user = CustomUser.objects.create_user(
        email=email,
        password=password,
        full_name=full_name,
        major=major,
        year=year,
        username=email.split("@")[0],  # Use email prefix as username
    )
    user.save()

    # Generate QR Code
    qr_data = f"{user.id}:{user.email}:{user.full_name}"
    qr = qrcode.make(qr_data)
    qr_io = BytesIO()
    qr.save(qr_io, format="PNG")

    # Serve QR Code as download
    response = HttpResponse(qr_io.getvalue(), content_type="image/png")
    response["Content-Disposition"] = f"attachment; filename={user.username}_qrcode.png"

    # Log the user in
    login(request, user)

    return response


def user_logout(request):
    logout(request)
    context = UserSerializer(request.user).data
    print(context)

    return JsonResponse(context, status=200)


class user_list(ListAPIView):
    serializer_class = UserListSerializer

    def get_queryset(self):
        if "pattern" in self.kwargs:

            return User.objects.filter(username__contains=self.kwargs["pattern"])

        return User.objects.all()
