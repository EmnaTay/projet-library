from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    contracts = serializers.SerializerMethodField()

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
