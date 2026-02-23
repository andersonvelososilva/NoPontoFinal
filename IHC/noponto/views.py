from django.shortcuts import render
from .models import Horario, Linha

def index(request):
    return render(request, 'telas/index.html')
    

def search(request):
    origin = request.GET.get('origin', '')
    destination = request.GET.get('destination', '')
    
    # Simple filtering for demonstration
    results_list = list(Horario.objects.filter(
        linha__origem__icontains=origin,
        linha__destino__icontains=destination
    ))
    
    # Ensure at least 5 results are shown, independent of the search
    if len(results_list) < 5:
        # Get additional results that are NOT already in the results list
        existing_ids = [r.id for r in results_list]
        extra_results = Horario.objects.exclude(id__in=existing_ids)[:5 - len(results_list)]
        results_list.extend(list(extra_results))
    
    context = {
        'results': results_list,
        'origin': origin,
        'destination': destination,
    }
    
    print("origem", origin)
    print("Destino", destination)
    print("Resultado", len(results_list)) 
    return render(request, 'telas/search_results.html', context)

def login_view(request):
    return render(request, 'telas/login.html')

def signup_view(request):
    return render(request, 'telas/signup.html')

def routes(request):
    return render(request, 'telas/routes.html')

def offers(request):
    return render(request, 'telas/offers.html')

def manage_booking(request):
    return render(request, 'telas/manage_booking.html')
