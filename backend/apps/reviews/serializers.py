from rest_framework import serializers
from apps.reviews.models import Review, ReviewImage, ReviewVote, ReviewReply
from apps.accounts.serializers import UserSerializer


class ReviewImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewImage
        fields = ["id", "image"]


class ReviewReplySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = ReviewReply
        fields = ["id", "user_name", "comment", "created_at"]
        read_only_fields = ["id", "user_name", "created_at"]


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    images = ReviewImageSerializer(many=True, read_only=True)
    replies = ReviewReplySerializer(many=True, read_only=True)
    user_has_voted = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            "id",
            "user",
            "rating",
            "title",
            "comment",
            "is_verified_purchase",
            "helpful_count",
            "images",
            "replies",
            "user_has_voted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_verified_purchase", "helpful_count", "created_at", "updated_at"]

    def get_user_has_voted(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return ReviewVote.objects.filter(review=obj, user=request.user).exists()
        return None


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["rating", "title", "comment"]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating 1-5 orasida bo'lishi kerak")
        return value

    def validate(self, data):
        book = self.context.get("book")
        user = self.context.get("request").user
        if Review.objects.filter(book=book, user=user).exists():
            raise serializers.ValidationError({"error": "Siz allaqachon sharh qoldirgansiz"})
        return data


class ReviewVoteSerializer(serializers.Serializer):
    is_helpful = serializers.BooleanField()
