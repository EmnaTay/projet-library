<<<<<<< HEAD
from django.contrib.auth.models import User
from rest_framework import serializers

=======
from rest_framework import serializers
from .models import CustomUser
>>>>>>> fadd66ce05bf65f1bcad3b9d4b325ef240a4cb0d


class UserSerializer(serializers.ModelSerializer):
    contracts = serializers.SerializerMethodField()
<<<<<<< HEAD
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_staff', 'is_authenticated', 'contracts')

    def get_contracts(self, user):
        if user.is_authenticated:
            return [contract.book_id for contract in user.contracts.filter(status__in=['waiting', 'late', 'active'])]
        
        return []



class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')
        ordering = ('username',)
=======

    class Meta:
        model = CustomUser
        fields = (
            "id",
            "full_name",
            "email",
            "major",
            "year",
            "is_staff",
            "is_authenticated",
            "contracts",
        )

    def get_contracts(self, user):
        if user.is_authenticated:
            return [
                contract.book_id
                for contract in user.contracts.filter(
                    status__in=["waiting", "late", "active"]
                )
            ]
        return []


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "full_name", "email", "major", "year")
        ordering = ("full_name",)
>>>>>>> fadd66ce05bf65f1bcad3b9d4b325ef240a4cb0d
