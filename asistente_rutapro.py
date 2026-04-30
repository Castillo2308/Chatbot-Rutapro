import argparse
import json
import re
import unicodedata
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple


DEFAULT_STOPWORDS: Set[str] = {
    "el",
    "la",
    "de",
    "y",
    "a",
    "en",
    "es",
    "que",
    "un",
    "una",
    "los",
    "las",
    "del",
    "al",
    "con",
    "por",
    "su",
    "para",
    "se",
    "mas",
    "me",
    "mi",
    "tu",
    "te",
    "lo",
    "le",
    "les",
    "como",
    "cual",
    "cuales",
    "cuando",
    "donde",
    "porque",
    "que",
    "hacer",
    "debo",
    "puedo",
}


INTENT_KEYWORDS: Dict[str, Set[str]] = {
    "saludo": {"hola", "buenas", "saludos", "buenos", "dias", "tardes", "noches"},
    "despedida": {"adios", "chao", "hasta", "luego", "nos", "vemos"},
    "agradecimiento": {"gracias", "agradecido", "agradecida"},
    "pregunta": {"que", "como", "cuando", "donde", "por", "cual", "puedo", "debo"},
}


EMBEDDED_KNOWLEDGE_JSON = r'''
{
    "chatbot_config": {
        "nombre": "RutaPro",
        "version": "1.0",
        "proposito": "Chatbot educativo para aprender conducción segura en Costa Rica",
        "personalidad": {
            "tipo": "Amigable, paciente y servicial",
            "descripcion": "Explica con calma y motiva al estudiante a aprender sin presión.",
            "enfoque": "Educativo y motivacional"
        },
        "tono_comunicacion": {
            "estilo": "Sencillo, claro y motivador",
            "caracteristicas": [
                "Usa palabras fáciles de entender",
                "Da confianza y seguridad",
                "Evita tecnicismos innecesarios",
                "Es respetuoso y empático"
            ]
        },
        "respuestas_predeterminadas": {
            "saludo_inicial": "¡Hola! Soy RutaPro, y te voy a ayudar a aprender a manejar de forma fácil y segura.",
            "no_entiende": "No entendí bien tu mensaje. Intentá decirlo con otras palabras y con gusto te ayudo.",
            "despedida": "¡Muchos éxitos en tu aprendizaje! Practicá con paciencia y confianza.",
            "error_general": "Disculpá, parece que hay un problema. Intentá hacer tu pregunta nuevamente.",
            "felicitacion": "¡Muy bien! Seguí así, estás en el camino correcto.",
            "ofrecimiento_ayuda": "¿Hay algo más en lo que pueda ayudarte? Estoy aquí para que aprendas de forma segura."
        },
        "idioma": "Español (Costa Rica)",
        "nivel_educativo": "Preparación para examen teórico de conducción",
        "constructor": "Sistema de base de conocimiento para chatbot",
        "ultima_actualizacion": "2026-04-16"
    },
    "knowledge_base": {
        "señales_de_transito": [
            {
                "id": "señal_alto",
                "patterns": [
                    "qué significa la señal de alto",
                    "cómo actúo ante una señal de alto",
                    "qué debo hacer en un alto",
                    "detenimiento obligatorio",
                    "señal roja octagonal",
                    "alto en la carretera"
                ],
                "answer": "La señal de ALTO es una señal octagonal de color rojo con letras blancas. Indica que DEBES detener completamente tu vehículo antes de proceder. Debes ceder el paso a los vehículos que circulan por la vía de la derecha. Esta señal tiene prioridad absoluta y es obligatorio detenerse, incluso si no ves vehículos aproximándose."
            },
            {
                "id": "señal_ceda",
                "patterns": [
                    "qué significa ceda el paso",
                    "cómo actúo ante una señal de ceda",
                    "ceda el paso explicación",
                    "señal triangular roja",
                    "ceder el paso en la vía"
                ],
                "answer": "La señal de CEDA EL PASO es triangular con borde rojo. Indica que debes reducir la velocidad y asegurarte de que no hay vehículos en la vía principal antes de incorporarte. A diferencia del ALTO, no es obligatorio detenerse si la vía está despejada, pero debes estar listo para frenar si es necesario. Siempre cede el paso a los vehículos que circulan por la vía de la derecha."
            },
            {
                "id": "señal_velocidad",
                "patterns": [
                    "límite de velocidad máxima",
                    "velocidad permitida",
                    "cuál es la velocidad máxima",
                    "señal de velocidad",
                    "velocidad máxima indicada"
                ],
                "answer": "Las señales de límite de velocidad son rectangulares y de color blanco con números en negro. Indican la VELOCIDAD MÁXIMA permitida en esa zona. Debes adaptarte a estas velocidades considerando las condiciones climáticas, del tránsito y del camino. Exceder el límite de velocidad es una infracción que puede resultar en multas y afectar tu licencia de conducción."
            },
            {
                "id": "señal_prohibido",
                "patterns": [
                    "qué significa un círculo rojo",
                    "señal prohibida",
                    "señal de prohibición",
                    "circulación prohibida",
                    "no pasar"
                ],
                "answer": "Las señales de prohibición son circulares con fondo blanco, borde y línea diagonal roja. Algunas de las más comunes son: Prohibido pasar (línea diagonal roja), Prohibido estacionar, Prohibido girar. Estas señales indican acciones que NO DEBES realizar. Violarlas es una infracción y puede resultar en multas o acciones legales."
            },
            {
                "id": "señal_obligatorio",
                "patterns": [
                    "qué significa un círculo azul",
                    "señales obligatorias",
                    "qué debo hacer",
                    "señal circular azul",
                    "indicaciones obligatorias"
                ],
                "answer": "Las señales obligatorias son circulares con fondo azul. Indican acciones que DEBES realizar, como mantener la derecha, circular en una dirección específica o usar equipo de seguridad. Estas señales son mandatorias y cumplirlas es obligatorio por ley. Ejemplos: Mantenga la derecha, Circulación obligatoria en esta dirección."
            },
            {
                "id": "señal_advertencia",
                "patterns": [
                    "señales de advertencia",
                    "triangulares amarillas",
                    "qué significan las señales amarillas",
                    "precaución necesaria",
                    "señales de peligro"
                ],
                "answer": "Las señales de advertencia son triangulares con fondo amarillo y símbolo negro. Alertan sobre condiciones de peligro o cambios en la vía, tales como: Curva peligrosa, Zona escolar, Construcción o reparación, Tránsito irregular, Semáforo. Estas señales ADVIERTEN sobre situaciones donde debes estar atento y reducir velocidad si es necesario."
            },
            {
                "id": "señal_informativa",
                "patterns": [
                    "señales informativas",
                    "señales azules",
                    "dónde queda la gasolinera",
                    "dónde es el hospital",
                    "señales de servicio"
                ],
                "answer": "Las señales informativas son rectangulares, generalmente verdes o azules. Proporcionan información sobre servicios, distancias, direcciones y lugares de interés como gasolineras, hospitales, restaurantes, de refugios u otra información turística. No son restrictivas, simplemente te informan sobre lo que hay disponible en la zona."
            },
            {
                "id": "linea_blanca_continua",
                "patterns": [
                    "qué significa línea blanca continua",
                    "puedo cruzar línea blanca",
                    "línea blanca en la carretera",
                    "prohibido cambiar de carril"
                ],
                "answer": "Una LÍNEA BLANCA CONTINUA en la carretera indica que NO PUEDES cambiar de carril o cruzarla. Marcan el borde de la vía o delimitan carriles donde no está permitido el cambio. Cruzar una línea blanca continua es una infracción y puede resultar en multas."
            },
            {
                "id": "linea_blanca_discontinua",
                "patterns": [
                    "línea blanca punteada",
                    "puedo cruzar línea segmentada",
                    "línea discontinua en carretera",
                    "cambio de carril permitido"
                ],
                "answer": "Una LÍNEA BLANCA DISCONTINUA (punteada) indica que PUEDES cambiar de carril, pero siempre cerciorándote de que es seguro hacerlo. Debes verificar espejos, puntos ciegos y usar las señales de giro. El cambio de carril debe ser seguro y no debe afectar a otros vehículos."
            },
            {
                "id": "linea_amarilla",
                "patterns": [
                    "qué significa línea amarilla",
                    "línea amarilla en carretera",
                    "puedo pasar línea amarilla",
                    "prohibido adelantar"
                ],
                "answer": "Una LÍNEA AMARILLA en el centro de la vía indica ZONA DE NO ADELANTAMIENTO. Si es continua, NO PUEDES cruzarla. Si es discontinua, puedes adelantar solo si tienes completa seguridad y visibilidad. Las líneas amarillas existen para prevenir accidentes en zonas peligrosas. No respetar esta línea puede resultar en multas y sanciones graves."
            }
        ],
        "prioridad_de_paso": [
            {
                "id": "rotonda",
                "patterns": [
                    "cómo funciona una rotonda",
                    "quién tiene prioridad en la rotonda",
                    "cómo pasar por una rotonda",
                    "reglas de circulación en rotonda",
                    "quién pasa primero en rotonda"
                ],
                "answer": "En una ROTONDA, los vehículos que YA ESTÁN CIRCULANDO DENTRO tienen prioridad. Al entrar, debes ceder el paso frenando o reduciendo velocidad si es necesario. Circula en sentido antihorario (a la izquierda internacionalmente, pero en Costa Rica varía según la rotonda). Señaliza tu salida anticipadamente. Cuando salgas, apaga la señal de giro."
            },
            {
                "id": "peatones_paso",
                "patterns": [
                    "prioridad peatonal",
                    "qué debo hacer con peatones",
                    "peatones en paso",
                    "cómo actuar con peatones cruzando",
                    "quién tiene prioridad peatón o auto"
                ],
                "answer": "Los PEATONES tienen PRIORIDAD ABSOLUTA en los pasos peatonales. Debes reducir la velocidad y estar listo para frenar. Si un peatón cruza dentro de un paso indicado (pintura blanca), DEBES DETENERTE completamente. No conducir sobre pasos peatonales a exceso de velocidad es una infracción grave. Siempre sé atento a niños, adultos mayores y personas con discapacidades."
            },
            {
                "id": "semaforo",
                "patterns": [
                    "cómo funcionan los semáforos",
                    "qué significa luz roja",
                    "qué significa luz amarilla",
                    "qué significa luz verde",
                    "reglas de semáforo"
                ],
                "answer": "Los SEMÁFOROS regulan el flujo de tránsito: LUZ ROJA = DETENERSE completamente. LUZ AMARILLA = Precaución, prepárate para detenerte (a menos que estés muy cerca). LUZ VERDE = Puedes avanzar, pero verifica primero que no haya peatones u otros peligros. Si la luz está en ROJO, no puedes avanzar incluso si no ves vehículos. Respetar semáforos previene accidentes graves."
            },
            {
                "id": "entrada_salida",
                "patterns": [
                    "quién tiene prioridad al entrar a la carretera",
                    "salida de vía privada",
                    "incorporarse a vía principal",
                    "prioridad entre vías",
                    "vehículos en vía principal"
                ],
                "answer": "Los vehículos que YA CIRCULAN en la vía principal tienen prioridad. Al entrar desde una vía privada o secundaria a una vía principal, DEBES CEDER EL PASO. Reduce la velocidad, verifica que no haya vehículos aproximándose y luego incorporate cuando sea seguro. Los vehículos en la vía principal no necesitan reducir velocidad ni cambiar trayectoria."
            },
            {
                "id": "prioridad_derecha",
                "patterns": [
                    "regla de la derecha",
                    "quién tiene prioridad a la derecha",
                    "vehículo de la derecha",
                    "prioridad por posición"
                ],
                "answer": "La REGLA DE LA DERECHA establece que cuando dos vehículos llegan simultáneamente a una intersección sin señalización clara, el vehículo que viene de la DERECHA tiene prioridad. Debes ceder el paso en esta situación. Esta regla se aplica principalmente en intersecciones sin semáforo ni señal de alto/ceda."
            },
            {
                "id": "ciclovias",
                "patterns": [
                    "prioridad con ciclistas",
                    "qué hacer ante ciclovía",
                    "ciclista en carretera",
                    "carril para bicicletas",
                    "cómo comportarte con ciclistas"
                ],
                "answer": "Los CICLISTAS son usuarios vulnerables de la vía. Debes mantener distancia segura (al menos 1.5 metros) al adelantarlos. Respeta los ciclocarriles. Nunca los obstrucciones o acoses. Si hay carril exclusivo para bicicletas, no invadas ese espacio. Los ciclistas tienen los mismos derechos en la vía que cualquier otro usuario."
            },
            {
                "id": "vehiculos_emergencia",
                "patterns": [
                    "qué hacer ante ambulancia o bomberos",
                    "vehículos de emergencia",
                    "cómo comportarse ante sirena",
                    "prioridad ambulancia",
                    "vehículos de servicios de emergencia"
                ],
                "answer": "Los vehículos de EMERGENCIA (ambulancia, bomberos, policía) tienen PRIORIDAD ABSOLUTA. Cuando escuches sirena, debes: 1) Identificar de dónde viene, 2) Reducir velocidad, 3) Orillarte hacia la derecha y detenerte. NO aceleres ni bloquees su paso. Estos vehículos están respondiendo a situaciones de vida o muerte, así que coopera siempre."
            }
        ],
        "normas_de_circulacion": [
            {
                "id": "manejo_defensivo",
                "patterns": [
                    "qué es conducción defensiva",
                    "cómo conducir defensivamente",
                    "técnicas de defensa en la vía",
                    "anticiparse a peligros"
                ],
                "answer": "La CONDUCCIÓN DEFENSIVA implica anticiparse a posibles peligros y estar siempre preparado. Técnicas clave: 1) Mantén distancia de seguridad (3 segundos), 2) Verifica constantemente espejos, 3) Anticipa acciones de otros conductores, 4) Reduce velocidad en zonas peligrosas, 5) Evita distracciones al conducir, 6) No asumas que otros conductores seguirán las reglas. Conducir defensivamente te mantiene seguro."
            },
            {
                "id": "distancia_seguridad",
                "patterns": [
                    "cuál es la distancia segura entre vehículos",
                    "distancia de frenado",
                    "cuánto espacio debo dejar",
                    "regla de los tres segundos",
                    "carril de seguridad"
                ],
                "answer": "La REGLA DE LOS TRES SEGUNDOS es la forma más común de calcular distancia segura: selecciona un objeto fijo frente a ti, cuando el vehículo delantero lo pasa, comienza a contar. Si llegas a ese punto antes de contar tres segundos, estás muy cerca. En lluvia, nieve o luz baja, aumenta a 6 segundos. Una distancia adecuada te permite frenar sin colisionar en caso de emergencia."
            },
            {
                "id": "cambio_carril",
                "patterns": [
                    "cómo cambiar de carril correctamente",
                    "pasos para cambiar de carril",
                    "cuándo puedo cambiar de carril",
                    "señales de cambio de carril"
                ],
                "answer": "PASOS CORRECTOS: 1) Verifica espejos (retrovisor y costados), 2) Mira punto ciego (gira cabeza), 3) Activa señal de giro con anticipación, 4) Cambia de carril suavemente, 5) Apaga señal. NUNCA cambies sin señal. NUNCA cambes múltiples carriles de una vez. Asegúrate de que otros conductores te vean. El cambio debe ser seguro y no afectar a otros vehículos."
            },
            {
                "id": "adelantamiento",
                "patterns": [
                    "cómo adelantar correctamente",
                    "pasos para adelantar",
                    "cuándo no puedo adelantar",
                    "reglas de adelantamiento"
                ],
                "answer": "ANTES DE ADELANTAR: 1) Verifica líneas (no haya línea amarilla continua), 2) Comprueba visibilidad total, 3) No hay vehículos aproximándose de frente. DURANTE: 1) Acelera para acortar tiempo de adelantamiento, 2) Mantén distancia segura, 3) Usa luz de giro. DESPUÉS: 1) Regresa al carril solo cuando veas el vehículo en espejo retrovisor. NUNCA adelantes en curvas, crestas o zonas de peatones. Adelantar imprudentemente es muy peligroso."
            },
            {
                "id": "estacionamiento",
                "patterns": [
                    "dónde puedo estacionar",
                    "zonas de no estacionamiento",
                    "cómo estacionar correctamente",
                    "estacionamiento prohibido"
                ],
                "answer": "PUEDES estacionar en zonas permitidas, respetando señalización. NO estaciones: 1) En pasos peatonales o zonas marcadas en rojo, 2) En esquinas o curvas, 3) En zonas de carga, 4) Frente a hidrantes, 5) Sobre aceras o zonas verdes sin autorización. Al estacionar: 1) Busca zona segura e iluminada, 2) Estaciona correctamente en línea, 3) Aplica freno de emergencia, 4) Cierra puertas y ventanas, 5) Retira artículos de valor del vehículo."
            },
            {
                "id": "marcha_atras",
                "patterns": [
                    "cómo conducir en marcha atrás",
                    "cuándo usar marcha atrás",
                    "precauciones en reversa",
                    "estacionar en reversa"
                ],
                "answer": "Al conducir en MARCHA ATRÁS: 1) Gira cabeza hacia atrás para máxima visibilidad, 2) Usa espejos constantemente, 3) Muévete lentamente, 4) Verifica puntos ciegos, 5) Si alguien te guía, sigue sus instrucciones, 6) Ten cuidado con peatones, especialmente niños. En vehículos modernos, usa cámara de reversa si está disponible. Nunca conduzcas hacia atrás a velocidad alta o largas distancias."
            },
            {
                "id": "giros",
                "patterns": [
                    "cómo girar correctamente",
                    "dónde posicionarse para girar",
                    "señalización de giro",
                    "giros a la derecha e izquierda"
                ],
                "answer": "PASOS PARA GIRAR: 1) Anticipa tu giro con distancia, 2) Posiciónate en el carril correcto (izquierda para girar izquierda), 3) Activa señal de giro, 4) Reduce velocidad gradualmente, 5) Verifica que sea seguro (sin peatones, vehículos), 6) Gira suavemente, 7) Completa el giro en el carril correcto. En intersecciones con semáforo, espera flecha verde. En rotondas, gira a la derecha salvo que la flecha indique lo contrario."
            },
            {
                "id": "lluvia_niebla",
                "patterns": [
                    "cómo conducir en lluvia",
                    "conducción en niebla",
                    "lluvia fuerte en carretera",
                    "visibilidad reducida"
                ],
                "answer": "EN LLUVIA/NIEBLA: 1) Reduce velocidad significativamente, 2) Aumenta distancia de frenado a 6 segundos o más, 3) Enciende luces (no altas si hay vehículos enfrente), 4) Usa limpiaparabrisas, 5) Ten cuidado con charcos (aquaplaning), 6) No aceleres bruscamente, 7) Frena suavemente. Si la visibilidad es muy baja, considera detener tu vehículo en zona segura. En Costa Rica, lluvia es frecuente, así que maneja con mayor precaución durante estación lluviosa."
            },
            {
                "id": "noche",
                "patterns": [
                    "cómo conducir de noche",
                    "conducción nocturna",
                    "luces del vehículo",
                    "visibilidad en la noche"
                ],
                "answer": "AL CONDUCIR DE NOCHE: 1) Usa luces bajas (cambia a altas cuando no hay vehículos enfrente), 2) Reduce velocidad, 3) Aumenta distancia de frenado, 4) Desactiva luces interiores para mejor visibilidad exterior, 5) Toma descansos frecuentes si estás fatigado, 6) Evita viajar solo si es posible, 7) Revisa que luces funcionen correctamente. La noche aumenta riesgos, así que conduce con máxima atención y precaución."
            }
        ],
        "limites_de_velocidad": [
            {
                "id": "velocidad_escuelas",
                "patterns": [
                    "velocidad máxima en escuelas",
                    "cuál es el límite en zona escolar",
                    "escuela zona de seguridad",
                    "tiempo escolar conducción",
                    "seguridad escolar en carretera"
                ],
                "answer": "En ZONAS ESCOLARES, el límite de velocidad máxima es generalmente 25 km/h o menor según señalización específica. Este límite existe para proteger a los niños que atraviesan o caminan cerca de la escuela. Debes estar especialmente atento a: 1) Niños cruzando inesperadamente, 2) Paraderos de autobús, 3) Actividades escolares. Exceder velocidad en zona escolar es una infracción grave."
            },
            {
                "id": "velocidad_hospitals",
                "patterns": [
                    "límite de velocidad en hospital",
                    "velocidad en zona de hospital",
                    "hospital zonas tranquilas",
                    "conducción cerca de hospital"
                ],
                "answer": "En ZONAS DE HOSPITAL/SALUD, se debe conducir a VELOCIDAD REDUCIDA (generalmente 25 km/h). Estas zonas existen para no perturbar reposo de pacientes y por seguridad. Debes: 1) Reducir velocidad anticipadamente, 2) Usar sonido de claxon solo si es absolutamente necesario, 3) No estacionar en paradas de ambulancia, 4) Estar atento a vehículos de emergencia. Esta norma es parte de la responsabilidad social del conductor."
            },
            {
                "id": "velocidad_residencial",
                "patterns": [
                    "límite de velocidad en zona residencial",
                    "barrios y velocidad",
                    "urbanización conducción",
                    "zonas de viviendas límite"
                ],
                "answer": "En ZONAS RESIDENCIALES, el límite típico es entre 40-50 km/h según señalización local. Debes estar atento a: 1) Niños jugando, 2) Peatones cruzando, 3) Autos estacionados que pueden moverse. Conduce con precaución incluso si el límite teórico te lo permite. Los residentes tienen derecho a zona tranquila y segura. En Costa Rica varía por municipio, así que respeta siempre la señalización local."
            },
            {
                "id": "velocidad_carretera",
                "patterns": [
                    "velocidad en carretera nacional",
                    "límite en ruta interamericana",
                    "velocidad máxima en rutas principales",
                    "autopista límite de velocidad"
                ],
                "answer": "En CARRETERAS/AUTOPISTAS el límite típico es 100 km/h para autos particulares (puede ser 80 km/h en zonas específicas). Camiones y vehículos de transporte tienen límites menores. Mantén esta velocidad considerando: 1) Condiciones climáticas, 2) Tránsito, 3) Visibilidad, 4) Estado del vehículo. La velocidad excesiva es la principal causa de accidentes fatales en carreteras. Adapta tu velocidad a la realidad de la vía."
            },
            {
                "id": "velocidad_ciudad",
                "patterns": [
                    "velocidad en ciudad",
                    "zona urbana límite",
                    "calles de la ciudad",
                    "velocidad en San José"
                ],
                "answer": "En ZONAS URBANAS/CIUDADES, el límite típico es 60 km/h en avenidas principales y 40-50 km/h en calles secundarias según señalización. Algunos sectores pueden tener 30 km/h. Conduce siempre: 1) Atento a peatones, 2) A velocidad que te permita frenar en distancia de seguridad, 3) Respetando todas las señales. El exceso de velocidad en ciudad es infracción grave con multas altas."
            },
            {
                "id": "adaptacion_velocidad",
                "patterns": [
                    "cuándo debo reducir velocidad",
                    "adaptación de velocidad",
                    "factores para reducir velocidad",
                    "velocidad según condiciones"
                ],
                "answer": "DEBES REDUCIR VELOCIDAD en: 1) Lluvia o niebla (visibilidad reducida), 2) Noche sin buena iluminación, 3) Vías en mal estado, 4) Zonas escolares/hospitales, 5) Congestión de tránsito, 6) Curvas peligrosas, 7) Zonas de construcción, 8) Presencia de peatones/ciclistas, 9) Cuando te sientas cansado. La velocidad debe SIEMPRE ser segura para las condiciones actuales, incluso si el límite legal es mayor."
            },
            {
                "id": "multas_velocidad",
                "patterns": [
                    "multas por exceso de velocidad",
                    "cuánto cuesta exceso de velocidad",
                    "puntos por multa de velocidad",
                    "sanciones por velocidad"
                ],
                "answer": "El EXCESO DE VELOCIDAD tiene consecuencias serias: 1) MULTAS (varían según cuánto excesDas), 2) PUNTOS en licencia (acumulación puede causar suspensión), 3) RETENCIÓN de vehículo en infracciones graves, 4) AUMENTO en seguros. En Costa Rica, las multas aumentan si reincides. Exceso muy grave (más de 40 km/h sobre límite) puede resultar en retiro de licencia temporal. Conducir a velocidad segura te ahorra dinero y vidas."
            }
        ],
        "conduccion_defensiva": [
            {
                "id": "atencion_distracciones",
                "patterns": [
                    "cómo evitar distracciones",
                    "celular mientras conduces",
                    "distracciones en la conducción",
                    "cómo mantener concentración"
                ],
                "answer": "EVITA DISTRACCIONES: 1) NO USES CELULAR mientras conduces (prohibido por ley), 2) Configura GPS antes de partir, 3) No comas/bebas mientras conduces, 4) Mantén volumen de radio moderado, 5) No mires a otros vehículos/accidentes, 6) Evita conversaciones que requieran atención total, 7) Si necesitas atender algo, detente en zona segura. El celular mientras conduces es la causa principal de accidentes. Tu única responsabilidad al volante es conducir seguramente."
            },
            {
                "id": "fatiga_cansancio",
                "patterns": [
                    "conducir cansado",
                    "cómo evitar fatiga",
                    "sueño mientras conduces",
                    "viajes largos fatiga"
                ],
                "answer": "NO CONDUZCAS SI ESTÁS: 1) Cansado o somnoliento, 2) Enfermo con fiebre/medicinas que causen somnolencia, 3) Bajo efectos de alcohol/drogas. PREVENCIÓN: 1) Duerme 7-8 horas antes de conducir, 2) En viajes largos, detente cada 2 horas, 3) Acompaña con otro conductor si es posible, 4) Toma café/bebida energética (con moderación), 5) Abre ventanas para aire fresco. La fatiga afecta reacción y juicio. Si sientes sueño, detente inmediatamente."
            },
            {
                "id": "rabia_carretera",
                "patterns": [
                    "rabia al conducir",
                    "cómo controlar la frustración",
                    "otro conductor me insulta",
                    "comportamiento agresivo en vía",
                    "manejo de emociones"
                ],
                "answer": "LA RABIA EN LA CARRETERA es peligrosa: 1) Si otro conductor te ofende, IGNORA (no retalijes), 2) NUNCA respondas agresivamente, 3) No hagas gestos obscenos, 4) No aceleres para alcanzar a quien te molestó, 5) Si sientes rabia, respira profundamente y reduce velocidad, 6) Recuerda: tu vida vale más. La 'rabia de carretera' causa accidentes graves. Mantén calma, sé paciente, deja que otros conductores cometan errores sin afectarte."
            },
            {
                "id": "evaluacion_riesgos",
                "patterns": [
                    "cómo identificar riesgos",
                    "evaluar situaciones peligrosas",
                    "anticipar peligros en carretera",
                    "prevención de accidentes"
                ],
                "answer": "IDENTIFICA RIESGOS observando: 1) Comportamiento de otros conductores (cambios bruscos), 2) Condiciones de la vía (baches, aceite), 3) Condiciones climáticas, 4) Visibilidad limitada, 5) Velocidades inadecuadas, 6) Intersecciones complicadas. ANTE RIESGO: 1) Reduce velocidad, 2) Aumenta distancia de seguimiento, 3) Prepárate para frenar, 4) Busca ruta alternativa si es posible. Anticipar problemas te da tiempo para reaccionar adecuadamente, previniendo accidentes."
            },
            {
                "id": "mantenimiento_vehiculo",
                "patterns": [
                    "cómo mantener el vehículo",
                    "inspección antes de viajar",
                    "revisiones del auto",
                    "partes importantes del vehículo"
                ],
                "answer": "MANTÉN TU VEHÍCULO: 1) Revisa llantas (presión y desgaste) mensualmente, 2) Frenos: si sientes esponjosidad o ruidos, revisa, 3) Luces: todas deben funcionar, 4) Limpiaparabrisas: reemplaza regularmente, 5) Fluidos: aceite, refrigerante, líquido de frenos, 6) Batería: revisar carga. ANTES DE VIAJAR: verifica todas estas cosas. Un vehículo mal mantenido es peligroso. El mantenimiento preventivo es más barato que reparaciones de emergencia y salva vidas."
            },
            {
                "id": "conduccion_defensiva_tecnicas",
                "patterns": [
                    "técnicas de conducción defensiva",
                    "cómo aplicar defensa",
                    "estrategias defensivas",
                    "seguridad en carretera"
                ],
                "answer": "TÉCNICAS DEFENSIVAS: 1) ANTICIPA: prevé lo que otros harán, 2) DISTANCIA: mantén 3 segundos de espaciamiento, 3) VELOCIDAD: adapta a condiciones reales, 4) VISIBILIDAD: mira constantemente espejos y alrededor, 5) POSICIÓN: mantente en carril correcto, 6) COMUNICACIÓN: usa señales para indicar tus acciones, 7) FLEXIBILIDAD: ajusta tácticas según situación. Conducir defensivamente significa reconocer que otros conductores pueden cometer errores y estar sempre preparado para evitarlos."
            },
            {
                "id": "estres_conduccion",
                "patterns": [
                    "conducir con estrés",
                    "ansiedad en la carretera",
                    "miedo a conducir",
                    "cómo relajarse al volante"
                ],
                "answer": "EL ESTRÉS AFECTA CONDUCCIÓN: 1) Tome respiraciones profundas antes de conducir, 2) Pon música relajante, 3) Planifica con tiempo (no tengas prisa), 4) Evita horarios de tránsito intenso si es posible, 5) Usa técnicas de relajación muscular, 6) Si sientes pánico, detente en zona segura. Un conductor estresado toma decisiones malas. Si sueles sentir ansiedad, considera participar en cursos de conducción defensiva o habla con profesional de salud mental."
            }
        ],
        "seguridad_vial": [
            {
                "id": "cinturon_seguridad",
                "patterns": [
                    "cómo usar cinturón de seguridad",
                    "importancia del cinturón",
                    "cinturón salva vidas",
                    "uso obligatorio del cinturón",
                    "multas por no usar cinturón"
                ],
                "answer": "El CINTURÓN DE SEGURIDAD es OBLIGATORIO y SALVA VIDAS: 1) Todos los ocupantes deben usarlo (incluyendo traseros), 2) Cierra diagonal sobre pecho y cadera, 3) No debe estar torcido, 4) Revisa que ajuste correctamente, 5) Para niños menores de 12 años, usa silla apropiada. Los cinturones reducen riesgo de muerte en 45%. NO usar cinturón es infracción con multa. Conducir responsablemente incluye garantizar que todos usen cinturón adecuadamente."
            },
            {
                "id": "airbags",
                "patterns": [
                    "cómo funcionan airbags",
                    "seguridad con airbags",
                    "airbag de pasajero",
                    "qué son bolsas de aire"
                ],
                "answer": "LOS AIRBAGS son sistemas de seguridad suplementarios (trabajan CON cinturón, no en lugar de): 1) Se inflan durante colisión para proteger cabeza y pecho, 2) Los modernos vehículos tienen múltiples airbags (frontal, lateral, cortina), 3) Debes mantener distancia entre volante y pecho (30 cm), 4) Si hay niños, desactiva airbag de pasajero. Los airbags + cinturón = protección máxima. No desactives airbags innecesariamente."
            },
            {
                "id": "sillas_ninos",
                "patterns": [
                    "sillas de seguridad para niños",
                    "cómo instalar silla de niño",
                    "edad para silla de seguridad",
                    "transporte seguro de menores"
                ],
                "answer": "LAS SILLAS DE SEGURIDAD SON OBLIGATORIAS: 1) Menores de 4 años: silla convertible orientada hacia atrás, 2) 4-12 años o menos de 135 cm: silla elevadora con respaldo, 3) Mayores a esto pero menores de 18: cinturón de seguridad regular. INSTALACIÓN: sigue instrucciones del fabricante, asegúrate que esté firme. NUNCA lleves niños en brazos o en asiento delantero. Las sillas reducen riesgo de lesión grave en 70%. El transporte seguro de niños es responsabilidad paternal."
            },
            {
                "id": "caso_accidente",
                "patterns": [
                    "qué hacer si tengo accidente",
                    "pasos después de accidente",
                    "contactar policía después de choque",
                    "documentar accidente"
                ],
                "answer": "SI TIENES ACCIDENTE: 1) Verifica que estés seguro, 2) Enciende luces de emergencia, 3) Si es posible, quita vehículos de la vía, 4) Llama a emergencias si hay lesionados (911), 5) Reporta a la policía de tránsito, 6) Intercambia información con otro conductor (nombre, teléfono, placa, aseguradora), 7) Toma fotos de la escena y daños, 8) No admitas culpa, deja que reportes determinen. Manten calma, la prioridad es seguridad. Contacta tu aseguradora después."
            },
            {
                "id": "alcohol_drogas",
                "patterns": [
                    "conducir bajo alcohol",
                    "drogas y conducción",
                    "cómo detectar intoxicación",
                    "multa por conducir ebrio",
                    "límite legal de alcohol"
                ],
                "answer": "CONDUCIR BAJO ALCOHOL/DROGAS ES EXTREMADAMENTE PELIGROSO Y ILEGAL: 1) El límite legal en Costa Rica es 0.05% de alcohol en sangre, 2) Primera ofensa: multa fuerte + suspensión temporal, 3) Reincidencia: retiro de licencia hasta 3 años, 4) Pode resultar en prisión si causa accidente. El alcohol afecta: visión, reacción, juicio. NUNCA CONDUZCAS si consumiste alcohol o drogas. Si vas a beber, usa taxi, Uber o que alguien sin alcohol conduzca."
            },
            {
                "id": "lluvia_conduccion",
                "patterns": [
                    "seguridad en lluvia",
                    "cómo frenar en lluvia",
                    "aquaplaning qué es",
                    "hidroplaneo en la carretera"
                ],
                "answer": "LLUVIA REDUCE TRACCIÓN: 1) El aquaplaning ocurre cuando llanta no toca carretera (agua intermedia), 2) Síntomas: pérdida de control, volante no responde, 3) SI OCURRE: NO frenes bruscamente, mantén volante recto, acelera ligeramente hasta recuperar tracción. PREVENCIÓN: 1) Reduce velocidad, 2) Aumenta distancia de frenado a 6+ segundos, 3) Evita charcos profundos, 4) Revisa presión de llantas (baja presión aumenta riesgo). En Costa Rica, lluvia es frecuente, así que domina estas técnicas."
            },
            {
                "id": "emergencias_volante",
                "patterns": [
                    "frenazos de emergencia",
                    "cómo frenar de emergencia",
                    "dirección de emergencia",
                    "pérdida de frenos"
                ],
                "answer": "EN EMERGENCIA DE FRENADO: 1) Pisa freno con toda la fuerza (ABS hace el trabajo), 2) NO bombees frenos modernos con ABS, 3) Mantén volante recto. SI PIERDES FRENOS: 1) Bombea frenos varias veces, 2) Usa freno de estacionamiento gradualmente, 3) Busca cuesta arriba o zona para desacelerar, 4) Avisa otros conductores con luces. SI PIERDES DIRECCIÓN: 1) NO sobre-corrijas, 2) Reduce velocidad suavemente, 3) Mantén volante firme. Estas situaciones requieren entrenamiento, así que toma cursos de conducción defensiva."
            },
            {
                "id": "botiquin_emergencia",
                "patterns": [
                    "botiquín de primeros auxilios",
                    "qué llevar en el auto",
                    "equipo de emergencia",
                    "kit de seguridad vial"
                ],
                "answer": "LLEVA EN TU VEHÍCULO: 1) Botiquín de primeros auxilios (vendas, desinfectante, gasa), 2) Triángulos de seguridad, 3) Linterna con baterías, 4) Extintor de incendios, 5) Cables de batería, 6) Destornillador y herramientas básicas, 7) Documentos del vehículo, 8) Número de emergencias. RECOMENDADO ADICIONAL: 1) Cámara de emergencia o dashcam, 2) Agua y snacks, 3) Manta de emergencia. Este equipo puede salvar vidas en situaciones inesperadas."
            },
            {
                "id": "seguridad_noche",
                "patterns": [
                    "cómo estar seguro de noche",
                    "viajar de noche seguridad",
                    "rutas peligrosas",
                    "seguridad personal en auto"
                ],
                "answer": "SEGURIDAD NOCTURNA: 1) Revisa que todas las luces funcionen, 2) Mantén puertas cerradas en semáforos/esperas, 3) Ten ruta planificada, 4) Avisa a alguien tu destino y hora estimada, 5) Conduce por rutas conocidas/iluminadas, 6) No abras a desconocidos, 7) Si alguien te sigue, ve a estación de policía, 8) Confía en tu instinto. Las mujeres especialmente deben tomar precauciones extra. La seguridad personal es parte de conducción responsable."
            }
        ]
    }
}
'''


@dataclass
class PatternEntry:
    entry_id: str
    category: str
    answer: str
    pattern: str
    pattern_clean: str
    pattern_tokens: Set[str]


@dataclass
class EvidenceCase:
    query: str
    expected: str
    description: str


class RutaProAssistant:
    def __init__(self, knowledge_path: Path, threshold: float = 0.36, ambiguity_margin: float = 0.05) -> None:
        self.knowledge_path = knowledge_path
        self.threshold = threshold
        self.ambiguity_margin = ambiguity_margin
        self.config: Dict = {}
        self.kb_entries: List[PatternEntry] = []
        self._load_knowledge()

    @staticmethod
    def _strip_accents(text: str) -> str:
        normalized = unicodedata.normalize("NFD", text)
        return "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")

    def preprocess_text(self, text: str) -> Dict[str, object]:
        text_lower = text.lower().strip()
        text_normalized = self._strip_accents(text_lower)
        text_normalized = re.sub(r"[^a-z0-9\s]", " ", text_normalized)
        text_normalized = re.sub(r"\s+", " ", text_normalized).strip()

        tokens = text_normalized.split() if text_normalized else []
        filtered_tokens = [tok for tok in tokens if tok not in DEFAULT_STOPWORDS]
        clean_text = " ".join(filtered_tokens)

        return {
            "original": text,
            "lower": text_lower,
            "normalized": text_normalized,
            "tokens": tokens,
            "filtered_tokens": filtered_tokens,
            "clean_text": clean_text,
        }

    def detect_intent(self, preprocessed: Dict[str, object]) -> str:
        tokens = set(preprocessed["tokens"])

        for intent in ("saludo", "despedida", "agradecimiento"):
            if tokens & INTENT_KEYWORDS[intent]:
                return intent

        if "?" in str(preprocessed["original"]) or tokens & INTENT_KEYWORDS["pregunta"]:
            return "pregunta"

        return "desconocido"

    def _load_knowledge(self) -> None:
        data: Dict[str, object]

        if self.knowledge_path.exists():
            with self.knowledge_path.open("r", encoding="utf-8") as fh:
                data = json.load(fh)
        else:
            data = json.loads(EMBEDDED_KNOWLEDGE_JSON)

        self.config = data.get("chatbot_config", {})
        self.kb_entries = []

        for category, items in data.get("knowledge_base", {}).items():
            for item in items:
                answer = item.get("answer", "")
                entry_id = item.get("id", "sin_id")
                for pattern in item.get("patterns", []):
                    pre = self.preprocess_text(pattern)
                    self.kb_entries.append(
                        PatternEntry(
                            entry_id=entry_id,
                            category=category,
                            answer=answer,
                            pattern=pattern,
                            pattern_clean=str(pre["clean_text"]),
                            pattern_tokens=set(pre["filtered_tokens"]),
                        )
                    )

    @staticmethod
    def _token_overlap_score(query_tokens: Set[str], pattern_tokens: Set[str]) -> float:
        if not query_tokens or not pattern_tokens:
            return 0.0

        intersection = len(query_tokens & pattern_tokens)
        union = len(query_tokens | pattern_tokens)
        return intersection / union if union else 0.0

    @staticmethod
    def _string_similarity(a: str, b: str) -> float:
        if not a or not b:
            return 0.0
        return SequenceMatcher(None, a, b).ratio()

    def find_best_match(
        self,
        preprocessed: Dict[str, object],
    ) -> Tuple[Optional[PatternEntry], float, Optional[PatternEntry], float]:
        query_tokens = set(preprocessed["filtered_tokens"])
        query_clean = str(preprocessed["clean_text"])

        best_score = 0.0
        second_score = 0.0
        best_entry: Optional[PatternEntry] = None
        second_entry: Optional[PatternEntry] = None

        for entry in self.kb_entries:
            overlap = self._token_overlap_score(query_tokens, entry.pattern_tokens)
            similarity = self._string_similarity(query_clean, entry.pattern_clean)

            # Combina coincidencia semantica por tokens y similitud textual.
            score = (0.65 * overlap) + (0.35 * similarity)

            if score > best_score:
                second_score = best_score
                second_entry = best_entry
                best_score = score
                best_entry = entry
            elif score > second_score:
                second_score = score
                second_entry = entry

        return best_entry, best_score, second_entry, second_score

    def generate_response(
        self,
        intent: str,
        best_entry: Optional[PatternEntry],
        best_score: float,
        second_entry: Optional[PatternEntry],
        second_score: float,
    ) -> str:
        fixed = self.config.get("respuestas_predeterminadas", {})

        if intent == "saludo":
            return fixed.get(
                "saludo_inicial",
                "Hola, soy RutaPro. Estoy listo para ayudarte con consultas de conduccion segura.",
            )

        if intent == "despedida":
            return fixed.get("despedida", "Hasta luego. Te deseo una conduccion segura.")

        if intent == "agradecimiento":
            felic = fixed.get("felicitacion", "Con gusto.")
            offer = fixed.get("ofrecimiento_ayuda", "Si necesitas algo mas, aqui estoy.")
            return f"{felic} {offer}"

        if (
            intent == "pregunta"
            and best_entry
            and second_entry
            and best_score >= self.threshold
            and abs(best_score - second_score) <= self.ambiguity_margin
        ):
            return (
                "Tu consulta puede referirse a mas de un tema y prefiero responder con precision. "
                "Podrias detallar un poco mas tu pregunta?"
            )

        if intent in {"pregunta", "desconocido"} and best_entry and best_score >= self.threshold:
            return (
                f"Encontré información relevante ({best_score:.2f}). "
                f"Tema: {best_entry.category.replace('_', ' ')}. "
                f"{best_entry.answer}"
            )

        return fixed.get(
            "no_entiende",
            "No encuentro una respuesta clara en la base de conocimiento para esa consulta.",
        )

    def reply(self, message: str) -> Dict[str, object]:
        pre = self.preprocess_text(message)
        intent = self.detect_intent(pre)
        best_entry, score, second_entry, second_score = self.find_best_match(pre)
        response = self.generate_response(intent, best_entry, score, second_entry, second_score)

        return {
            "input": message,
            "intent": intent,
            "preprocess": pre,
            "best_match": {
                "id": best_entry.entry_id if best_entry else None,
                "category": best_entry.category if best_entry else None,
                "pattern": best_entry.pattern if best_entry else None,
                "score": round(score, 4),
            },
            "second_match": {
                "id": second_entry.entry_id if second_entry else None,
                "category": second_entry.category if second_entry else None,
                "pattern": second_entry.pattern if second_entry else None,
                "score": round(second_score, 4),
            },
            "response": response,
        }


EVIDENCE_CASES: List[EvidenceCase] = [
    EvidenceCase(
        query="Hola, RutaPro",
        expected="ok",
        description="Saludo reconocido por deteccion de intencion.",
    ),
    EvidenceCase(
        query="Que significa la señal de alto?",
        expected="ok",
        description="Consulta de base de conocimiento de senales.",
    ),
    EvidenceCase(
        query="Como debo conducir en lluvia fuerte?",
        expected="ok",
        description="Consulta valida sobre normas de circulacion.",
    ),
    EvidenceCase(
        query="Cual es la receta para hacer arroz?",
        expected="fallo_esperado",
        description="Consulta fuera de contexto respecto a conduccion.",
    ),
    EvidenceCase(
        query="Necesito ayuda con algebra lineal",
        expected="fallo_esperado",
        description="Consulta no contemplada en la base.",
    ),
    EvidenceCase(
        query="Eso no se entiende",
        expected="fallo_esperado",
        description="Entrada ambigua sin intencion clara.",
    ),
]


def _is_case_success(result: Dict[str, object], expected: str, threshold: float) -> bool:
    intent = str(result["intent"])
    score = float(result["best_match"]["score"])

    if expected == "ok":
        if intent in {"saludo", "agradecimiento", "despedida"}:
            return True
        return score >= threshold

    return score < threshold


def run_demo_tests(bot: RutaProAssistant) -> None:
    print("=== EVIDENCIA DE FUNCIONAMIENTO (PRUEBAS) ===")
    passed = 0

    for idx, case in enumerate(EVIDENCE_CASES, start=1):
        result = bot.reply(case.query)
        ok = _is_case_success(result, case.expected, bot.threshold)
        if ok:
            passed += 1

        print(f"\nCaso {idx}")
        print(f"Tipo de caso: {case.expected}")
        print(f"Descripcion: {case.description}")
        print(f"Entrada: {case.query}")
        print(f"Intencion detectada: {result['intent']}")
        best = result["best_match"]
        second = result["second_match"]
        print(
            "Mejor coincidencia: "
            f"id={best['id']} | categoria={best['category']} | score={best['score']}"
        )
        print(
            "Segunda coincidencia: "
            f"id={second['id']} | categoria={second['category']} | score={second['score']}"
        )
        print(f"Respuesta: {result['response']}")
        print(f"Resultado de validacion: {'PASS' if ok else 'FAIL'}")

    print("\n=== RESUMEN ===")
    print(f"Casos aprobados: {passed}/{len(EVIDENCE_CASES)}")
    print("Incluye al menos 3 casos correctos y casos fuera de contexto/ambiguos.")


def interactive_chat(bot: RutaProAssistant) -> None:
    bot_name = bot.config.get("nombre", "RutaPro")

    greet = bot.config.get("respuestas_predeterminadas", {}).get(
        "saludo_inicial", "Hola, soy RutaPro. Escribe tu consulta sobre conduccion segura."
    )
    print(greet)
    print("Escribe 'salir' para terminar.\n")

    while True:
        message = input("Tu: ").strip()
        if not message:
            continue
        if message.lower() in {"salir", "exit", "quit"}:
            bye = bot.config.get("respuestas_predeterminadas", {}).get(
                "despedida", "Hasta luego."
            )
            print(f"{bot_name}: {bye}")
            break

        result = bot.reply(message)
        print(f"{bot_name}: {result['response']}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Asistente virtual RutaPro")
    parser.add_argument(
        "--knowledge",
        default="RutaPro-knowledge.json",
        help="Ruta al archivo JSON de base de conocimiento (si no existe, usa la base embebida)",
    )
    parser.add_argument(
        "--demo-tests",
        action="store_true",
        help="Ejecuta casos de prueba de evidencia",
    )
    parser.add_argument(
        "--threshold",
        type=float,
        default=0.36,
        help="Umbral minimo de similitud para aceptar una respuesta de la base",
    )
    parser.add_argument(
        "--ambiguity-margin",
        type=float,
        default=0.05,
        help="Margen para detectar respuestas ambiguas entre los dos mejores resultados",
    )
    args = parser.parse_args()

    knowledge_path = Path(args.knowledge)

    bot = RutaProAssistant(
        knowledge_path=knowledge_path,
        threshold=args.threshold,
        ambiguity_margin=args.ambiguity_margin,
    )

    if args.demo_tests:
        run_demo_tests(bot)
    else:
        interactive_chat(bot)


if __name__ == "__main__":
    main()
