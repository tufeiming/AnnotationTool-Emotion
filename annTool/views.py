from django.shortcuts import render


# Create your views here.

def lable(request):
    return render(request, 'label.html')
