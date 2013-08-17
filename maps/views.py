from django.http import HttpResponse
from django.shortcuts import render

from maps.models import Nation
from maps.models import Player

def index(request):
    all_nations = Nation.objects.all()[:]
    context = {'all_nations': all_nations}
    return render(request, 'maps/index.html', context)

def detail(request, player_id):
    return HttpResponse("You're looking at poll %s." % player_id)

def results(request, player_id):
    return HttpResponse("You're looking at the results of poll %s." % player_id)

def vote(request, player_id):
    return HttpResponse("You're voting on poll %s." % player_id)