from rest_framework import serializers


class BaseSerializer(serializers.ModelSerializer):
    pass


class ReadOnlySerializer(serializers.Serializer):
    def to_representation(self, instance):
        return super().to_representation(instance)


class ErrorSerializer(serializers.Serializer):
    error = serializers.CharField()
    detail = serializers.CharField(required=False)
    details = serializers.DictField(required=False)
