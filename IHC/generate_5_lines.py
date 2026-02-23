import os
import django
from datetime import time, timedelta
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

from noponto.models import Onibus, Linha, Rota, Horario

def populate_extra():
    print("Generating 5 additional lines...")
    
    # Ensure at least one bus exists
    bus, _ = Onibus.objects.get_or_create(
        modelo="Volvo B11R",
        placa="DEF-5678",
        defaults={
            'numero_veiculo': 202,
            'capacidade_total': 50,
            'ano': 2024,
            'acessibilidade': True
        }
    )

    routes_data = [
        {"origem": "São Paulo", "destino": "Rio de Janeiro", "nome": "Ponte Aérea Rodoviária", "tarifa": 120.00},
        {"origem": "Belo Horizonte", "destino": "Brasília", "nome": "Linha Capital", "tarifa": 150.00},
        {"origem": "Teresina", "destino": "Fortaleza", "nome": "Expresso Nordeste", "tarifa": 95.00},
        {"origem": "Salvador", "destino": "Recife", "nome": "Litoral Norte", "tarifa": 110.00},
        {"origem": "Porto Alegre", "destino": "Gramado", "nome": "Rota Romântica", "tarifa": 60.00}
    ]

    for i, data in enumerate(routes_data):
        linha, _ = Linha.objects.get_or_create(
            codigo=f"WEB{i+10}",
            defaults={
                "nome": data["nome"],
                "origem": data["origem"],
                "destino": data["destino"],
                "tarifa": data["tarifa"]
            }
        )
        
        rota, _ = Rota.objects.get_or_create(
            sentido="Ida",
            linha=linha,
            defaults={
                "distancia": random.uniform(100, 1000),
                "tempo": timedelta(hours=random.randint(2, 12))
            }
        )
        
        Horario.objects.get_or_create(
            linha=linha,
            rota=rota,
            onibus=bus,
            horario_saida=time(random.randint(6, 22), 0),
            defaults={
                "horario_chegada": time((random.randint(6, 22) + 4) % 24, 0),
                "dia_semana": random.choice(["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"])
            }
        )

    print("5 lines generated successfully!")

if __name__ == "__main__":
    populate_extra()
