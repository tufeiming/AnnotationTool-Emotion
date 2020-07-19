from django.shortcuts import render


# Create your views here.

def index(request):
    return render(request, 'label.html')


# def check(request):
#     return render(request, 'check.html')
