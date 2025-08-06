from rest_framework import serializers
from .models import Course, Category, Lesson, Material, Enrollment, QuestionAnswer
from django.contrib.auth import get_user_model

User = get_user_model()

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['title','description']

# class InstructorSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['username','email','role']

class CourseSerializer(serializers.ModelSerializer):
    category_id = CategorySerializer(read_only=True)
    # instructor_id = InstructorSerializer(read_only=True)
    class Meta:
        model = Course
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'
class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

class QuestionAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionAnswer
        fields = '__all__'