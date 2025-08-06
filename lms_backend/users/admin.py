from django.contrib import admin
from users.models import User


@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        if form.cleaned_data.get("password"):
            obj.set_password(form.cleaned_data["password"])
        super().save_model(request, obj, form, change)