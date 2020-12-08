from django.shortcuts import render


# Create your views here.

def label(request):
    return render(request, 'label.html')
