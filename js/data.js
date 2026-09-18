/* KeySafe · contenu du portfolio. Les médias fournis utilisent src, full et document.
   Supports fournis et médias LinkedIn conservés, sans visuels de remplacement.
   Catalogue et provenance : sources/imported-media.json. */

window.KEYSAFE = {
  "settings": {
    "showMockupBadges": false,
    "photoFormats": [
      "jpg",
      "webp",
      "png"
    ],
    "verifiedMediaOnly": true
  },
  "contact": {
    "email": "commercial@keysafe.tn",
    "phone": "+21644970980",
    "phoneDisplay": "+216 44 970 980",
    "linkedin": "https://www.linkedin.com/company/keysafetn/",
    "signature": "Prévention · Formation · Accompagnement HSE"
  },
  "clients": [
    {
      "id": "tesca",
      "name": "TESCA",
      "accent": "#5BB8F0",
      "sector": "Industrie automobile",
      "city": "Grombalia"
    },
    {
      "id": "psc",
      "name": "PSC",
      "accent": "#F2715A",
      "sector": "",
      "city": ""
    },
    {
      "id": "socohuile",
      "name": "SOCOHUILE",
      "accent": "#E7B84C",
      "sector": "Huiles alimentaires",
      "city": "Sfax"
    }
  ],
  "chapters": [
    {
      "id": "bureaux",
      "number": "01",
      "short": "Bureaux",
      "code": "Information",
      "layout": "corridor",
      "title": "Identification des bureaux",
      "titleLines": [
        "Identification",
        "des bureaux"
      ],
      "tagline": "Des espaces qui se lisent dès l’entrée.",
      "lead": "Plaques de porte, directoires et repères d’étage : une signalétique cohérente avec l’identité de chaque site, pour que visiteurs et collaborateurs trouvent leur chemin sans avoir à demander.",
      "deliverables": [
        "Plaques de porte",
        "Directoires & totems",
        "Numérotation des espaces",
        "Charte du site"
      ],
      "cover": {
        "src": "assets/photos/tesca/plaques-services.webp",
        "caption": "TESCA · Plaques des sept services",
        "contain": true
      }
    },
    {
      "id": "locaux",
      "number": "02",
      "short": "Locaux techniques",
      "code": "Accès réglementé",
      "layout": "spec",
      "title": "Identification des locaux techniques",
      "titleLines": [
        "Identification",
        "des locaux techniques"
      ],
      "tagline": "Identifier avant d’intervenir.",
      "lead": "Ateliers, magasins, locaux techniques et espaces de service : chaque zone porte une désignation claire, cohérente avec l’identité du site. Les équipes repèrent rapidement leur destination.",
      "deliverables": [
        "Plaques de porte",
        "Désignation des locaux",
        "Repérage des espaces",
        "Identité du site"
      ],
      "cover": {
        "src": "assets/photos/tesca/panneau-atelier-retordage.webp",
        "caption": "TESCA · Panneau Atelier de retordage",
        "contain": true
      }
    },
    {
      "id": "risques",
      "number": "03",
      "short": "Risques par local",
      "code": "Avertissement",
      "layout": "rooms",
      "title": "Affiches de risques spécifiques par local",
      "titleLines": [
        "Affiches de risques",
        "spécifiques par local"
      ],
      "tagline": "Le bon message, là où le risque existe.",
      "lead": "Une affiche par local : dangers présents, équipements de protection obligatoires, interdictions et conduite à tenir en cas d’urgence. Compréhensible en quelques secondes, au seuil de la zone.",
      "deliverables": [
        "Analyse par local",
        "Dangers · EPI · interdictions",
        "Consignes d’urgence",
        "Pictogrammes ISO 7010"
      ],
      "cover": {
        "src": "assets/photos/psc/atelier-1-pose.webp",
        "caption": "PSC · Affiche posée à l’atelier 1",
        "contain": true
      }
    },
    {
      "id": "plans",
      "number": "04",
      "short": "Circulation & évacuation",
      "code": "Évacuation",
      "layout": "plans",
      "title": "Plans de circulation & d’évacuation",
      "titleLines": [
        "Plans de circulation",
        "& d’évacuation"
      ],
      "tagline": "Savoir où passer. Savoir où sortir.",
      "lead": "Nous transformons le plan architecte en un document clair : flux piétons et engins, itinéraires d’évacuation par niveau, « Vous êtes ici », moyens de secours et point de rassemblement.",
      "deliverables": [
        "Plans de circulation",
        "Plans d’évacuation par niveau",
        "Points de rassemblement",
        "Consignes de sécurité"
      ],
      "cover": {
        "src": "assets/photos/tesca/evacuation-entrepot.webp",
        "caption": "TESCA · Plan d’évacuation de l’entrepôt",
        "contain": true
      },
      "subs": [
        {
          "id": "circulation",
          "label": "Circulation"
        },
        {
          "id": "evacuation",
          "label": "Évacuation"
        }
      ]
    }
  ],
  "zones": {
    "electrique": "Local électrique",
    "compresseurs": "Compresseurs",
    "chaufferie": "Chaufferie",
    "atelier": "Ateliers",
    "stockage": "Stockage",
    "laboratoire": "Laboratoire",
    "site": "Entrée du site",
    "circulation": "Circulation & engins",
    "escaliers": "Escaliers",
    "incendie": "Incendie",
    "secours": "Secours & urgence",
    "bureaux": "Bureaux",
    "manutention": "Manutention",
    "montecharge": "Monte-charge",
    "environnement": "Environnement",
    "hygiene": "Hygiène"
  },
  "shotTypes": {
    "plaque": "Plaque posée, cadrage 3/4 face à hauteur d’yeux, porte ou couloir visible autour. Lumière naturelle, pas de flash. Portrait 4:5.",
    "directory": "Directoire en situation, vu de l’entrée du couloir ou du hall. Une personne floue en arrière-plan peut donner de la vie. Portrait 4:5.",
    "door": "Porte du local entière, panneau lisible, sol visible. Puis un gros plan du panneau. Portrait 4:5.",
    "poster": "Affiche posée à l’entrée du local, cadrée de face et bien droite ; ajouter une vue plus large montrant le local. Portrait 3:4.",
    "circulation": "Photo de face du plan affiché + si possible une vue en hauteur (drone ou étage) du marquage au sol. Paysage 16:10.",
    "evacuation": "Plan photographié de face, sans reflet (angle léger), avec le cadre ou le support visible. Paysage 16:10.",
    "before": "Le plan d’origine (architecte ou ancien plan) scanné ou photographié. Même cadrage que le plan KeySafe pour la comparaison."
  },
  "projects": [
    {
      "id": "tesca-services",
      "client": "tesca",
      "chapter": "bureaux",
      "title": "Sept services, une même plaque TESCA",
      "need": "Identifier chaque service administratif avec une signalétique homogène.",
      "answer": "Une gamme de plaques de porte aux couleurs TESCA : Direction, Finance, Industrialisation, Qualité, Ressources humaines, Manufacturing & Supply Chain, Achats & Supply Chain.",
      "deliverables": [
        "Sept plaques de porte",
        "Gabarit commun à tous les services",
        "Identité TESCA"
      ],
      "images": [
        {
          "name": "plaques-services",
          "caption": "Gamme de plaques · Sept services TESCA",
          "type": "plaque",
          "kind": "artwork",
          "width": 1448,
          "height": 1086,
          "src": "assets/photos/tesca/plaques-services.webp",
          "full": "assets/photos/tesca/plaques-services-grand.webp"
        },
        {
          "name": "plaque-direction",
          "caption": "Plaque de porte · Direction",
          "type": "plaque",
          "kind": "artwork",
          "width": 704,
          "height": 254,
          "src": "assets/photos/tesca/plaque-direction.webp",
          "full": "assets/photos/tesca/plaque-direction-grand.webp"
        },
        {
          "name": "plaque-finance",
          "caption": "Plaque de porte · Finance",
          "type": "plaque",
          "kind": "artwork",
          "width": 709,
          "height": 254,
          "src": "assets/photos/tesca/plaque-finance.webp",
          "full": "assets/photos/tesca/plaque-finance-grand.webp"
        },
        {
          "name": "plaque-industrialisation",
          "caption": "Plaque de porte · Industrialisation",
          "type": "plaque",
          "kind": "artwork",
          "width": 703,
          "height": 253,
          "src": "assets/photos/tesca/plaque-industrialisation.webp",
          "full": "assets/photos/tesca/plaque-industrialisation-grand.webp"
        },
        {
          "name": "plaque-qualite",
          "caption": "Plaque de porte · Qualité",
          "type": "plaque",
          "kind": "artwork",
          "width": 709,
          "height": 253,
          "src": "assets/photos/tesca/plaque-qualite.webp",
          "full": "assets/photos/tesca/plaque-qualite-grand.webp"
        },
        {
          "name": "plaque-ressources-humaines",
          "caption": "Plaque de porte · Ressources humaines",
          "type": "plaque",
          "kind": "artwork",
          "width": 703,
          "height": 254,
          "src": "assets/photos/tesca/plaque-ressources-humaines.webp",
          "full": "assets/photos/tesca/plaque-ressources-humaines-grand.webp"
        },
        {
          "name": "plaque-manufacturing",
          "caption": "Plaque de porte · Manufacturing & Supply Chain",
          "type": "plaque",
          "kind": "artwork",
          "width": 710,
          "height": 254,
          "src": "assets/photos/tesca/plaque-manufacturing.webp",
          "full": "assets/photos/tesca/plaque-manufacturing-grand.webp"
        },
        {
          "name": "plaque-achats",
          "caption": "Plaque de porte · Achats & Supply Chain",
          "type": "plaque",
          "kind": "artwork",
          "width": 742,
          "height": 257,
          "src": "assets/photos/tesca/plaque-achats.webp",
          "full": "assets/photos/tesca/plaque-achats-grand.webp"
        }
      ]
    },
    {
      "id": "tesca-bureaux",
      "client": "tesca",
      "chapter": "bureaux",
      "title": "Du bureau magasinier à la direction : des repères cohérents",
      "need": "Nommer les espaces et orienter vers les services administratifs.",
      "answer": "Une plaque Bureau Magasinier, un directoire Direction générale / Finance / Ressources humaines et un gabarit d’informations pour la loge gardien.",
      "deliverables": [
        "Plaque Bureau Magasinier",
        "Directoire des services",
        "Tableau d’informations, quatre emplacements A4"
      ],
      "images": [
        {
          "name": "bureau-magasinier",
          "caption": "Plaque de porte · Bureau magasinier",
          "type": "plaque",
          "kind": "artwork",
          "width": 2977,
          "height": 1202,
          "src": "assets/photos/tesca/bureau-magasinier.webp",
          "full": "assets/photos/tesca/bureau-magasinier-grand.webp"
        },
        {
          "name": "direction-finance-rh",
          "caption": "Directoire · Direction générale, Finance et Ressources humaines",
          "type": "directory",
          "kind": "artwork",
          "width": 2977,
          "height": 3686,
          "src": "assets/photos/tesca/direction-finance-rh.webp",
          "full": "assets/photos/tesca/direction-finance-rh-grand.webp"
        },
        {
          "name": "loge-gardien",
          "caption": "Tableau d’informations · Loge gardien",
          "type": "directory",
          "kind": "template",
          "note": "Gabarit de tableau avec quatre emplacements pour documents A4.",
          "width": 1981,
          "height": 2800,
          "src": "assets/photos/tesca/loge-gardien.webp",
          "full": "assets/photos/tesca/loge-gardien-grand.webp",
          "document": "assets/documents/tesca/loge-gardien.pdf"
        }
      ]
    },
    {
      "id": "tesca-panneaux-locaux",
      "client": "tesca",
      "chapter": "locaux",
      "title": "Chaque local se reconnaît de loin",
      "need": "Identifier les ateliers, laboratoires et locaux techniques au premier regard, même avant de lire le texte.",
      "answer": "Des panneaux TESCA grand format qui associent le nom du local à une illustration de ce qu’il abrite : retordage, laboratoires, local médical, compresseurs, traitement d’air, déchets dangereux et loge gardien.",
      "deliverables": [
        "Huit panneaux d’identification illustrés",
        "Nom du local lisible à distance",
        "Identité TESCA"
      ],
      "images": [
        {
          "name": "panneau-atelier-retordage",
          "caption": "Panneau · Atelier de retordage",
          "type": "door",
          "kind": "artwork",
          "spec": "Machines de retordage",
          "width": 1536,
          "height": 1024,
          "src": "assets/photos/tesca/panneau-atelier-retordage.webp",
          "full": "assets/photos/tesca/panneau-atelier-retordage-grand.webp"
        },
        {
          "name": "panneau-laboratoire-analyses",
          "caption": "Panneau · Laboratoire (analyses)",
          "type": "door",
          "kind": "artwork",
          "spec": "Laboratoire d’analyses",
          "width": 4123,
          "height": 2945,
          "src": "assets/photos/tesca/panneau-laboratoire-analyses.webp",
          "full": "assets/photos/tesca/panneau-laboratoire-analyses-grand.webp"
        },
        {
          "name": "panneau-laboratoire-essais",
          "caption": "Panneau · Laboratoire (essais textiles)",
          "type": "door",
          "kind": "artwork",
          "spec": "Essais qualité des textiles",
          "width": 4123,
          "height": 2945,
          "src": "assets/photos/tesca/panneau-laboratoire-essais.webp",
          "full": "assets/photos/tesca/panneau-laboratoire-essais-grand.webp"
        },
        {
          "name": "panneau-local-medical",
          "caption": "Panneau · Local médical",
          "type": "door",
          "kind": "artwork",
          "spec": "Premiers soins",
          "width": 4123,
          "height": 2945,
          "src": "assets/photos/tesca/panneau-local-medical.webp",
          "full": "assets/photos/tesca/panneau-local-medical-grand.webp"
        },
        {
          "name": "panneau-compresseurs",
          "caption": "Panneau · Local compresseurs",
          "type": "door",
          "kind": "artwork",
          "spec": "Production d’air comprimé",
          "width": 4123,
          "height": 2945,
          "src": "assets/photos/tesca/panneau-compresseurs.webp",
          "full": "assets/photos/tesca/panneau-compresseurs-grand.webp"
        },
        {
          "name": "panneau-traitement-air",
          "caption": "Panneau · Centrale de traitement d’air",
          "type": "door",
          "kind": "artwork",
          "spec": "Ventilation et climatisation",
          "width": 4123,
          "height": 2945,
          "src": "assets/photos/tesca/panneau-traitement-air.webp",
          "full": "assets/photos/tesca/panneau-traitement-air-grand.webp"
        },
        {
          "name": "panneau-dechets-dangereux",
          "caption": "Panneau · Local déchets dangereux",
          "type": "door",
          "kind": "artwork",
          "spec": "Stockage des déchets dangereux",
          "width": 4123,
          "height": 2945,
          "src": "assets/photos/tesca/panneau-dechets-dangereux.webp",
          "full": "assets/photos/tesca/panneau-dechets-dangereux-grand.webp"
        },
        {
          "name": "panneau-loge-gardien",
          "caption": "Panneau · Loge gardien",
          "type": "door",
          "kind": "artwork",
          "spec": "Accueil et contrôle des accès",
          "width": 4123,
          "height": 2945,
          "src": "assets/photos/tesca/panneau-loge-gardien.webp",
          "full": "assets/photos/tesca/panneau-loge-gardien-grand.webp"
        }
      ]
    },
    {
      "id": "tesca-locaux",
      "client": "tesca",
      "chapter": "locaux",
      "title": "Six espaces, une même identité visuelle",
      "need": "Repérer les ateliers, les magasins et les espaces de service au premier regard.",
      "answer": "Des plaques TESCA sobres, avec une désignation lisible : maintenance, pièces de rechange, déchets, préparation, produits chimiques et production.",
      "deliverables": [
        "Six plaques d’identification",
        "Désignation propre à chaque espace",
        "Identité TESCA"
      ],
      "images": [
        {
          "name": "atelier-maintenance",
          "caption": "Plaque · Atelier maintenance",
          "type": "door",
          "kind": "artwork",
          "spec": "Identification de l’atelier",
          "width": 2977,
          "height": 1202,
          "src": "assets/photos/tesca/atelier-maintenance.webp",
          "full": "assets/photos/tesca/atelier-maintenance-grand.webp"
        },
        {
          "name": "magasin-pdr",
          "caption": "Plaque · Magasin PDR",
          "type": "door",
          "kind": "artwork",
          "spec": "Identification du magasin de pièces de rechange",
          "width": 2977,
          "height": 1202,
          "src": "assets/photos/tesca/magasin-pdr.webp",
          "full": "assets/photos/tesca/magasin-pdr-grand.webp"
        },
        {
          "name": "local-dechets",
          "caption": "Plaque · Local déchets",
          "type": "door",
          "kind": "artwork",
          "spec": "Repérage de la zone de collecte",
          "width": 2977,
          "height": 1202,
          "src": "assets/photos/tesca/local-dechets.webp",
          "full": "assets/photos/tesca/local-dechets-grand.webp"
        },
        {
          "name": "cuisine-preparation",
          "caption": "Plaque · Cuisine de préparation",
          "type": "door",
          "kind": "artwork",
          "spec": "Identification de l’espace de préparation",
          "width": 2977,
          "height": 1202,
          "src": "assets/photos/tesca/cuisine-preparation.webp",
          "full": "assets/photos/tesca/cuisine-preparation-grand.webp"
        },
        {
          "name": "magasin-produits-chimiques",
          "caption": "Plaque · Magasin produits chimiques",
          "type": "door",
          "kind": "artwork",
          "spec": "Identification du stockage des produits chimiques",
          "width": 2977,
          "height": 1202,
          "src": "assets/photos/tesca/magasin-produits-chimiques.webp",
          "full": "assets/photos/tesca/magasin-produits-chimiques-grand.webp"
        },
        {
          "name": "production",
          "caption": "Plaque · Production",
          "type": "door",
          "kind": "artwork",
          "spec": "Repérage de la zone de production",
          "width": 2977,
          "height": 1202,
          "src": "assets/photos/tesca/production.webp",
          "full": "assets/photos/tesca/production-grand.webp"
        }
      ]
    },
    {
      "id": "tesca-risques",
      "client": "tesca",
      "chapter": "risques",
      "title": "Une prévention adaptée à chaque situation de travail",
      "need": "Rendre les consignes accessibles dans l’entrepôt, le laboratoire, les ateliers, les bureaux et les zones de manutention.",
      "answer": "Des supports dédiés aux risques, aux EPI et aux gestes à suivre : produits chimiques, électricité, machines en mouvement, monte-charge, secours et incendie.",
      "deliverables": [
        "Affiches par espace et par risque",
        "Supports illustrés et bilingues",
        "Documents PDF consultables"
      ],
      "images": [
        {
          "name": "consignes-escalier",
          "caption": "Escaliers · Tenir la rampe",
          "type": "poster",
          "kind": "artwork",
          "zone": "escaliers",
          "width": 2105,
          "height": 2977,
          "src": "assets/photos/tesca/consignes-escalier.webp",
          "full": "assets/photos/tesca/consignes-escalier-grand.webp"
        },
        {
          "name": "consignes-chariots",
          "caption": "Chariots élévateurs · Règles de conduite",
          "type": "poster",
          "kind": "artwork",
          "zone": "circulation",
          "width": 4215,
          "height": 5960,
          "src": "assets/photos/tesca/consignes-chariots.webp",
          "full": "assets/photos/tesca/consignes-chariots-grand.webp"
        },
        {
          "name": "utilisation-extincteur",
          "caption": "Incendie · Utilisation d’un extincteur",
          "type": "poster",
          "kind": "artwork",
          "zone": "incendie",
          "width": 2105,
          "height": 2977,
          "src": "assets/photos/tesca/utilisation-extincteur.webp",
          "full": "assets/photos/tesca/utilisation-extincteur-grand.webp"
        },
        {
          "name": "consignes-entrepot",
          "caption": "Entrepôt · Dangers, interdictions et EPI",
          "type": "poster",
          "kind": "artwork",
          "zone": "stockage",
          "width": 5960,
          "height": 4215,
          "src": "assets/photos/tesca/consignes-entrepot.webp",
          "full": "assets/photos/tesca/consignes-entrepot-grand.webp"
        },
        {
          "name": "atelier-retordage-consignes",
          "caption": "Atelier de retordage · Risques mécaniques",
          "type": "poster",
          "kind": "artwork",
          "zone": "atelier",
          "width": 1122,
          "height": 1402,
          "src": "assets/photos/tesca/atelier-retordage-consignes.webp",
          "full": "assets/photos/tesca/atelier-retordage-consignes-grand.webp"
        },
        {
          "name": "consignes-site-ttg",
          "caption": "Site TTG · Consignes générales de sécurité",
          "type": "poster",
          "kind": "pdf",
          "zone": "site",
          "width": 2800,
          "height": 1981,
          "src": "assets/photos/tesca/consignes-site-ttg.webp",
          "full": "assets/photos/tesca/consignes-site-ttg-grand.webp",
          "document": "assets/documents/tesca/consignes-site-ttg.pdf"
        },
        {
          "name": "laboratoire-deversement",
          "caption": "Laboratoire · Déversement de produits chimiques",
          "type": "poster",
          "kind": "pdf",
          "zone": "laboratoire",
          "width": 1980,
          "height": 2800,
          "src": "assets/photos/tesca/laboratoire-deversement.webp",
          "full": "assets/photos/tesca/laboratoire-deversement-grand.webp",
          "document": "assets/documents/tesca/laboratoire-deversement.pdf"
        },
        {
          "name": "laboratoire-securite",
          "caption": "Laboratoire · Consignes de sécurité",
          "type": "poster",
          "kind": "pdf",
          "zone": "laboratoire",
          "width": 1980,
          "height": 2800,
          "src": "assets/photos/tesca/laboratoire-securite.webp",
          "full": "assets/photos/tesca/laboratoire-securite-grand.webp",
          "document": "assets/documents/tesca/laboratoire-securite.pdf"
        },
        {
          "name": "manutention-manuelle",
          "caption": "Manutention · Technique de levage",
          "type": "poster",
          "kind": "pdf",
          "zone": "manutention",
          "width": 1980,
          "height": 2800,
          "src": "assets/photos/tesca/manutention-manuelle.webp",
          "full": "assets/photos/tesca/manutention-manuelle-grand.webp",
          "document": "assets/documents/tesca/manutention-manuelle.pdf"
        },
        {
          "name": "armoire-electrique",
          "caption": "Armoire électrique · Danger d’électrocution",
          "type": "poster",
          "kind": "pdf",
          "zone": "electrique",
          "width": 1980,
          "height": 2800,
          "src": "assets/photos/tesca/armoire-electrique.webp",
          "full": "assets/photos/tesca/armoire-electrique-grand.webp",
          "document": "assets/documents/tesca/armoire-electrique.pdf"
        },
        {
          "name": "premiers-secours",
          "caption": "Premiers secours · Conduite à tenir",
          "type": "poster",
          "kind": "pdf",
          "zone": "secours",
          "width": 1980,
          "height": 2800,
          "src": "assets/photos/tesca/premiers-secours.webp",
          "full": "assets/photos/tesca/premiers-secours-grand.webp",
          "document": "assets/documents/tesca/premiers-secours.pdf"
        },
        {
          "name": "liste-secouristes-administration",
          "caption": "Liste des secouristes · Administration · QR code",
          "type": "poster",
          "kind": "artwork",
          "zone": "secours",
          "note": "Affiche de l’administration avec QR code. Ouvrir en grand pour le scanner.",
          "width": 1055,
          "height": 1491,
          "src": "assets/photos/tesca/liste-secouristes-administration.webp",
          "full": "assets/photos/tesca/liste-secouristes-administration-grand.webp"
        },
        {
          "name": "laboratoire-epi",
          "caption": "Laboratoire · Équipements de protection",
          "type": "poster",
          "kind": "pdf",
          "zone": "laboratoire",
          "width": 2800,
          "height": 1980,
          "src": "assets/photos/tesca/laboratoire-epi.webp",
          "full": "assets/photos/tesca/laboratoire-epi-grand.webp",
          "document": "assets/documents/tesca/laboratoire-epi.pdf"
        },
        {
          "name": "ergonomie-bureau",
          "caption": "Bureaux · Ergonomie du poste de travail",
          "type": "poster",
          "kind": "pdf",
          "zone": "bureaux",
          "width": 1980,
          "height": 2800,
          "src": "assets/photos/tesca/ergonomie-bureau.webp",
          "full": "assets/photos/tesca/ergonomie-bureau-grand.webp",
          "document": "assets/documents/tesca/ergonomie-bureau.pdf"
        },
        {
          "name": "monte-charge-utilisation",
          "caption": "Monte-charge · Consignes d’utilisation",
          "type": "poster",
          "kind": "pdf",
          "zone": "montecharge",
          "width": 1980,
          "height": 2800,
          "src": "assets/photos/tesca/monte-charge-utilisation.webp",
          "full": "assets/photos/tesca/monte-charge-utilisation-grand.webp",
          "document": "assets/documents/tesca/monte-charge-utilisation.pdf"
        },
        {
          "name": "monte-charge-securite",
          "caption": "Monte-charge · Dangers et obligations",
          "type": "poster",
          "kind": "pdf",
          "zone": "montecharge",
          "width": 2800,
          "height": 1980,
          "src": "assets/photos/tesca/monte-charge-securite.webp",
          "full": "assets/photos/tesca/monte-charge-securite-grand.webp",
          "document": "assets/documents/tesca/monte-charge-securite.pdf"
        }
      ]
    },
    {
      "id": "tesca-sensibilisation",
      "client": "tesca",
      "chapter": "risques",
      "title": "Les bons réflexes s’affichent aussi au quotidien",
      "need": "Accompagner les équipes dans leurs pratiques de bureau et leurs gestes environnementaux.",
      "answer": "Une collection de supports TESCA sur l’énergie, les impressions, les réunions et le tri des déchets, avec plusieurs déclinaisons graphiques.",
      "deliverables": [
        "Économies d’énergie et de papier",
        "Bonnes pratiques de réunion",
        "Tri des déchets"
      ],
      "images": [
        {
          "name": "energie-paysage",
          "caption": "Énergie · Économiser au quotidien, format paysage",
          "type": "poster",
          "kind": "artwork",
          "zone": "environnement",
          "width": 1491,
          "height": 1055,
          "src": "assets/photos/tesca/energie-paysage.webp",
          "full": "assets/photos/tesca/energie-paysage-grand.webp"
        },
        {
          "name": "impressions-responsables",
          "caption": "Bureaux · Des impressions responsables",
          "type": "poster",
          "kind": "artwork",
          "zone": "environnement",
          "width": 1055,
          "height": 1491,
          "src": "assets/photos/tesca/impressions-responsables.webp",
          "full": "assets/photos/tesca/impressions-responsables-grand.webp"
        },
        {
          "name": "energie-bureaux",
          "caption": "Bureaux · Réduire la consommation d’énergie",
          "type": "poster",
          "kind": "artwork",
          "zone": "environnement",
          "width": 1055,
          "height": 1491,
          "src": "assets/photos/tesca/energie-bureaux.webp",
          "full": "assets/photos/tesca/energie-bureaux-grand.webp"
        },
        {
          "name": "reunion-bonnes-pratiques",
          "caption": "Réunions · Les bonnes pratiques",
          "type": "poster",
          "kind": "artwork",
          "zone": "bureaux",
          "width": 1055,
          "height": 1491,
          "src": "assets/photos/tesca/reunion-bonnes-pratiques.webp",
          "full": "assets/photos/tesca/reunion-bonnes-pratiques-grand.webp"
        },
        {
          "name": "tri-dechets",
          "caption": "Environnement · Trier les déchets",
          "type": "poster",
          "kind": "artwork",
          "zone": "environnement",
          "width": 1491,
          "height": 1055,
          "src": "assets/photos/tesca/tri-dechets.webp",
          "full": "assets/photos/tesca/tri-dechets-grand.webp"
        },
        {
          "name": "reunion-variante",
          "caption": "Réunions · Variante du support",
          "type": "poster",
          "kind": "artwork",
          "zone": "bureaux",
          "width": 1058,
          "height": 1487,
          "src": "assets/photos/tesca/reunion-variante.webp",
          "full": "assets/photos/tesca/reunion-variante-grand.webp"
        }
      ]
    },
    {
      "id": "psc-risques",
      "client": "psc",
      "chapter": "risques",
      "title": "Les consignes prennent place sur le terrain",
      "need": "Mettre les messages de prévention au contact des équipes et de leur environnement de travail.",
      "answer": "Les photos montrent les supports PSI posés : atelier 1, chariots élévateurs, ergonomie, escaliers, premiers secours et incendie.",
      "deliverables": [
        "Affiches installées",
        "Consignes propres aux usages",
        "Reportage photographique sur site"
      ],
      "images": [
        {
          "name": "secours-pose",
          "caption": "Premiers secours · Affiche posée",
          "type": "poster",
          "kind": "photo",
          "zone": "secours",
          "width": 1200,
          "height": 1600,
          "src": "assets/photos/psc/secours-pose.webp",
          "full": "assets/photos/psc/secours-pose-grand.webp"
        },
        {
          "name": "chariots-pose",
          "caption": "Chariots élévateurs · Affiche posée",
          "type": "poster",
          "kind": "photo",
          "zone": "circulation",
          "width": 1200,
          "height": 1600,
          "src": "assets/photos/psc/chariots-pose.webp",
          "full": "assets/photos/psc/chariots-pose-grand.webp"
        },
        {
          "name": "securite-incendie-pose",
          "caption": "Consignes générales et extincteurs · Affiches posées",
          "type": "poster",
          "kind": "photo",
          "zone": "incendie",
          "width": 1600,
          "height": 1200,
          "src": "assets/photos/psc/securite-incendie-pose.webp",
          "full": "assets/photos/psc/securite-incendie-pose-grand.webp"
        },
        {
          "name": "atelier-1-pose",
          "caption": "Atelier 1 · Dangers, interdictions et EPI",
          "type": "poster",
          "kind": "photo",
          "zone": "atelier",
          "width": 1600,
          "height": 1200,
          "src": "assets/photos/psc/atelier-1-pose.webp",
          "full": "assets/photos/psc/atelier-1-pose-grand.webp"
        },
        {
          "name": "ergonomie-pose",
          "caption": "Bureaux · Affiche d’ergonomie posée",
          "type": "poster",
          "kind": "photo",
          "zone": "bureaux",
          "width": 1200,
          "height": 1600,
          "src": "assets/photos/psc/ergonomie-pose.webp",
          "full": "assets/photos/psc/ergonomie-pose-grand.webp"
        },
        {
          "name": "escalier-pose",
          "caption": "Escaliers · Affiche posée",
          "type": "poster",
          "kind": "photo",
          "zone": "escaliers",
          "width": 1200,
          "height": 1600,
          "src": "assets/photos/psc/escalier-pose.webp",
          "full": "assets/photos/psc/escalier-pose-grand.webp"
        }
      ]
    },
    {
      "id": "socohuile-risques",
      "client": "socohuile",
      "chapter": "risques",
      "title": "De l’accueil à la production, un langage de prévention commun",
      "need": "Décliner les messages de sécurité et d’hygiène selon les usages du site SOCOHUILE.",
      "answer": "Une série de supports au nom du client : entrée du site, chariots, ergonomie, escaliers, manutention et hygiène. Un gabarit permet de renseigner les contacts d’urgence propres au site.",
      "deliverables": [
        "Consignes générales et affiches par thème",
        "Hygiène du personnel et des mains",
        "PDF originaux et gabarit de contacts"
      ],
      "images": [
        {
          "name": "consignes-site",
          "caption": "Entrée du site · Consignes générales de sécurité",
          "type": "poster",
          "kind": "artwork",
          "zone": "site",
          "width": 8426,
          "height": 5958,
          "src": "assets/photos/socohuile/consignes-site.webp",
          "full": "assets/photos/socohuile/consignes-site-grand.webp",
          "document": "assets/documents/socohuile/consignes-site.pdf"
        },
        {
          "name": "chariots-elevateurs",
          "caption": "Chariots élévateurs · Règles de conduite",
          "type": "poster",
          "kind": "pdf",
          "zone": "circulation",
          "width": 1980,
          "height": 2800,
          "src": "assets/photos/socohuile/chariots-elevateurs.webp",
          "full": "assets/photos/socohuile/chariots-elevateurs-grand.webp",
          "document": "assets/documents/socohuile/chariots-elevateurs.pdf"
        },
        {
          "name": "ergonomie-bureaux",
          "caption": "Bureaux · Ergonomie du poste",
          "type": "poster",
          "kind": "pdf",
          "zone": "bureaux",
          "width": 1981,
          "height": 2800,
          "src": "assets/photos/socohuile/ergonomie-bureaux.webp",
          "full": "assets/photos/socohuile/ergonomie-bureaux-grand.webp",
          "document": "assets/documents/socohuile/ergonomie-bureaux.pdf"
        },
        {
          "name": "consignes-escalier",
          "caption": "Escaliers · Tenir la rampe",
          "type": "poster",
          "kind": "pdf",
          "zone": "escaliers",
          "width": 1981,
          "height": 2800,
          "src": "assets/photos/socohuile/consignes-escalier.webp",
          "full": "assets/photos/socohuile/consignes-escalier-grand.webp",
          "document": "assets/documents/socohuile/consignes-escalier.pdf"
        },
        {
          "name": "hygiene-personnel",
          "caption": "Production · Hygiène du personnel",
          "type": "poster",
          "kind": "pdf",
          "zone": "hygiene",
          "width": 1981,
          "height": 2800,
          "src": "assets/photos/socohuile/hygiene-personnel.webp",
          "full": "assets/photos/socohuile/hygiene-personnel-grand.webp",
          "document": "assets/documents/socohuile/hygiene-personnel.pdf"
        },
        {
          "name": "lavage-mains",
          "caption": "Hygiène · Lavage des mains",
          "type": "poster",
          "kind": "pdf",
          "zone": "hygiene",
          "width": 2800,
          "height": 1981,
          "src": "assets/photos/socohuile/lavage-mains.webp",
          "full": "assets/photos/socohuile/lavage-mains-grand.webp",
          "document": "assets/documents/socohuile/lavage-mains.pdf"
        },
        {
          "name": "manutention-manuelle",
          "caption": "Manutention · Technique de levage",
          "type": "poster",
          "kind": "pdf",
          "zone": "manutention",
          "width": 1981,
          "height": 2800,
          "src": "assets/photos/socohuile/manutention-manuelle.webp",
          "full": "assets/photos/socohuile/manutention-manuelle-grand.webp",
          "document": "assets/documents/socohuile/manutention-manuelle.pdf"
        },
        {
          "name": "numeros-urgence",
          "caption": "Urgence · Consignes et contacts du site",
          "type": "poster",
          "kind": "template",
          "zone": "secours",
          "note": "Gabarit personnalisable : numéros d’urgence et point de rassemblement à renseigner.",
          "width": 2800,
          "height": 1980,
          "src": "assets/photos/socohuile/numeros-urgence.webp",
          "full": "assets/photos/socohuile/numeros-urgence-grand.webp",
          "document": "assets/documents/socohuile/numeros-urgence.pdf"
        }
      ]
    },
    {
      "id": "tesca-circulation",
      "client": "tesca",
      "chapter": "plans",
      "sub": "circulation",
      "title": "L’entrepôt, ses flux et ses règles en une vue",
      "need": "Rendre les déplacements dans l’entrepôt faciles à comprendre.",
      "answer": "Une vue en volume qui montre le sens de circulation, les passages piétons et les consignes associées.",
      "deliverables": [
        "Plan de circulation de l’entrepôt",
        "Cheminements et sens de circulation",
        "Légende et consignes du site"
      ],
      "images": [
        {
          "name": "circulation-entrepot",
          "caption": "Plan de circulation · Entrepôt",
          "type": "circulation",
          "kind": "artwork",
          "width": 5960,
          "height": 4210,
          "src": "assets/photos/tesca/circulation-entrepot.webp",
          "full": "assets/photos/tesca/circulation-entrepot-grand.webp"
        }
      ]
    },
    {
      "id": "psc-circulation",
      "client": "psc",
      "chapter": "plans",
      "sub": "circulation",
      "title": "Le plan de circulation à l’entrée du site",
      "need": "Présenter les déplacements et rappeler les règles du site dans un même espace d’information.",
      "answer": "La photo montre le plan de circulation PSI affiché au-dessus des consignes générales de sécurité.",
      "deliverables": [
        "Plan de circulation affiché",
        "Panneau de consignes générales",
        "Vue de l’installation"
      ],
      "images": [
        {
          "name": "circulation-site-pose",
          "caption": "Plan de circulation et consignes du site · Panneaux posés",
          "type": "circulation",
          "kind": "photo",
          "width": 1200,
          "height": 1600,
          "src": "assets/photos/psc/circulation-site-pose.webp",
          "full": "assets/photos/psc/circulation-site-pose-grand.webp"
        }
      ]
    },
    {
      "id": "tesca-evacuation",
      "client": "tesca",
      "chapter": "plans",
      "sub": "evacuation",
      "title": "De l’entrepôt à l’administration, visualiser les sorties",
      "need": "Permettre de se situer et de repérer les cheminements et les moyens de secours.",
      "answer": "Deux plans distincts : l’entrepôt et l’administration, chacun avec ses repères « Vous êtes ici », sa légende et ses consignes.",
      "deliverables": [
        "Plan de l’entrepôt",
        "Plan de l’administration",
        "Sorties et moyens de secours"
      ],
      "images": [
        {
          "name": "evacuation-entrepot",
          "caption": "Plan d’évacuation · Entrepôt",
          "type": "evacuation",
          "kind": "artwork",
          "width": 5960,
          "height": 4210,
          "src": "assets/photos/tesca/evacuation-entrepot.webp",
          "full": "assets/photos/tesca/evacuation-entrepot-grand.webp"
        },
        {
          "name": "evacuation-administration",
          "caption": "Plan d’évacuation · Administration",
          "type": "evacuation",
          "kind": "artwork",
          "width": 8426,
          "height": 5952,
          "src": "assets/photos/tesca/evacuation-administration.webp",
          "full": "assets/photos/tesca/evacuation-administration-grand.webp"
        }
      ]
    },
    {
      "id": "psc-evacuation",
      "client": "psc",
      "chapter": "plans",
      "sub": "evacuation",
      "title": "Un plan d’évacuation affiché dans l’atelier n° 1",
      "need": "Donner aux équipes un repère visible pour comprendre l’évacuation de leur atelier.",
      "answer": "Le plan PSI est présenté en situation, dans son cadre, avec les cheminements, la légende et les consignes.",
      "deliverables": [
        "Plan d’évacuation de l’atelier n° 1",
        "Support encadré",
        "Photo de l’installation"
      ],
      "images": [
        {
          "name": "evacuation-atelier-1-pose",
          "caption": "Plan d’évacuation · Atelier n° 1",
          "type": "evacuation",
          "kind": "photo",
          "width": 1600,
          "height": 1200,
          "src": "assets/photos/psc/evacuation-atelier-1-pose.webp",
          "full": "assets/photos/psc/evacuation-atelier-1-pose-grand.webp"
        }
      ]
    }
  ],
  "videos": [
    {
      "id": "exercice",
      "chapter": "plans",
      "sub": "evacuation",
      "title": "Ce n’est pas un exercice. C’est une promesse.",
      "context": "Exercice d’évacuation · Ciments Jbel Oust",
      "src": "assets/video/exercice.mp4",
      "preview": "assets/video/exercice-preview.mp4",
      "poster": "assets/video/exercice-poster.webp",
      "duration": "2:32",
      "source": "https://www.linkedin.com/feed/update/urn:li:activity:7477275452492095488/"
    },
    {
      "id": "evacuation",
      "chapter": "plans",
      "sub": "evacuation",
      "title": "La préparation d’aujourd’hui est la sécurité de demain.",
      "context": "Simulation d’évacuation · EL KHOMSA – Rose Blanche Group",
      "src": "assets/video/evacuation.mp4",
      "preview": "assets/video/evacuation-preview.mp4",
      "poster": "assets/video/evacuation-poster.webp",
      "duration": "1:41",
      "source": "https://www.linkedin.com/feed/update/urn:li:activity:7484900739761213440/"
    },
    {
      "id": "safety-day",
      "title": "Une journée s’achève, son impact perdure.",
      "context": "Safety Day · Bondin",
      "src": "assets/video/safety-day.mp4",
      "preview": "assets/video/safety-day-preview.mp4",
      "poster": "assets/video/safety-day-poster.webp",
      "duration": "3:02",
      "source": "https://www.linkedin.com/feed/update/urn:li:activity:7479833958659215360/"
    },
    {
      "id": "incendie",
      "chapter": "risques",
      "zone": "incendie",
      "title": "Face au feu, chaque seconde compte.",
      "context": "Formation lutte contre l’incendie",
      "src": "assets/video/incendie.mp4",
      "preview": "assets/video/incendie-preview.mp4",
      "poster": "assets/video/incendie-poster.webp",
      "duration": "0:25",
      "source": "https://www.linkedin.com/feed/update/urn:li:activity:7493019414590676992/"
    }
  ],
  "terrain": [
    {
      "src": "assets/photos/psc/secours-pose.webp",
      "caption": "PSC · Premiers secours · Affiche posée",
      "client": "psc",
      "project": "psc-risques",
      "name": "secours-pose"
    },
    {
      "src": "assets/photos/psc/chariots-pose.webp",
      "caption": "PSC · Chariots élévateurs · Affiche posée",
      "client": "psc",
      "project": "psc-risques",
      "name": "chariots-pose"
    },
    {
      "src": "assets/photos/psc/securite-incendie-pose.webp",
      "caption": "PSC · Consignes générales et extincteurs · Affiches posées",
      "client": "psc",
      "project": "psc-risques",
      "name": "securite-incendie-pose"
    },
    {
      "src": "assets/photos/psc/circulation-site-pose.webp",
      "caption": "PSC · Plan de circulation et consignes du site · Panneaux posés",
      "client": "psc",
      "project": "psc-circulation",
      "name": "circulation-site-pose"
    },
    {
      "src": "assets/photos/psc/evacuation-atelier-1-pose.webp",
      "caption": "PSC · Plan d’évacuation · Atelier n° 1",
      "client": "psc",
      "project": "psc-evacuation",
      "name": "evacuation-atelier-1-pose"
    },
    {
      "src": "assets/photos/psc/atelier-1-pose.webp",
      "caption": "PSC · Atelier 1 · Dangers, interdictions et EPI",
      "client": "psc",
      "project": "psc-risques",
      "name": "atelier-1-pose"
    },
    {
      "src": "assets/photos/psc/ergonomie-pose.webp",
      "caption": "PSC · Bureaux · Affiche d’ergonomie posée",
      "client": "psc",
      "project": "psc-risques",
      "name": "ergonomie-pose"
    },
    {
      "src": "assets/photos/psc/escalier-pose.webp",
      "caption": "PSC · Escaliers · Affiche posée",
      "client": "psc",
      "project": "psc-risques",
      "name": "escalier-pose"
    },
    {
      "src": "assets/terrain/cjo-aerien.webp",
      "caption": "Ciments Jbel Oust · exercice",
      "source": "https://www.linkedin.com/feed/update/urn:li:activity:7477275452492095488/"
    },
    {
      "src": "assets/terrain/cjo-signaletique-medecin.webp",
      "caption": "Exercice · prise en charge d’un blessé",
      "source": "https://www.linkedin.com/feed/update/urn:li:activity:7477275452492095488/"
    },
    {
      "src": "assets/terrain/cjo-formation-1.webp",
      "caption": "Ciments Jbel Oust · risques en cimenterie",
      "source": "https://www.linkedin.com/feed/update/urn:li:activity:7487442620655370240/"
    },
    {
      "src": "assets/terrain/rose-blanche-caristes-2.webp",
      "caption": "Rose Blanche · habilitation caristes",
      "source": "https://www.linkedin.com/feed/update/urn:li:activity:7489953370108215297/"
    },
    {
      "src": "assets/terrain/rose-blanche-rassemblement.webp",
      "caption": "EL KHOMSA · point de rassemblement",
      "source": "https://www.linkedin.com/feed/update/urn:li:activity:7484900739761213440/"
    },
    {
      "src": "assets/terrain/psi-hse-4.webp",
      "caption": "PSI Tunisia · cycle HSE",
      "source": "https://www.linkedin.com/feed/update/urn:li:activity:7482343089035202560/"
    },
    {
      "src": "assets/terrain/premiers-secours-1.webp",
      "caption": "Formation premiers secours",
      "source": "https://www.linkedin.com/feed/update/urn:li:activity:7495427273383268352/"
    },
    {
      "src": "assets/terrain/cjo-rassemblement.webp",
      "caption": "Ciments Jbel Oust · rassemblement",
      "source": "https://www.linkedin.com/feed/update/urn:li:activity:7477275452492095488/"
    },
    {
      "src": "assets/terrain/psi-pic-1.webp",
      "caption": "PSI Tunisia · formation PIC",
      "source": "https://www.linkedin.com/feed/update/urn:li:activity:7504174011334029312/"
    },
    {
      "src": "assets/terrain/rose-blanche-caristes-4.webp",
      "caption": "Rose Blanche · conduite sécurisée",
      "source": "https://www.linkedin.com/feed/update/urn:li:activity:7489953370108215297/"
    }
  ],
  "audit": {
    "source": "https://www.linkedin.com/feed/update/urn:li:activity:7501913268865765376/",
    "quote": "Un affichage juste ne se juge pas au nombre de panneaux posés, mais à la vitesse à laquelle une personne qui découvre le site comprend ce qu’elle risque, ce qu’elle doit porter et par où elle sort.",
    "references": [
      "Code du travail",
      "ISO 7010",
      "NF X08-070"
    ],
    "domains": [
      {
        "kind": "emergency",
        "label": "Évacuation et issues de secours",
        "points": 11
      },
      {
        "kind": "prohibition",
        "label": "Interdictions",
        "points": 8
      },
      {
        "kind": "warning",
        "label": "Avertissements et dangers",
        "points": 8
      },
      {
        "kind": "fire",
        "label": "Moyens de secours et matériel d’urgence",
        "points": 8
      },
      {
        "kind": "info",
        "label": "Affichages réglementaires obligatoires",
        "points": 12
      },
      {
        "kind": "mandatory",
        "label": "Obligations et équipements de protection",
        "points": 8
      }
    ]
  },
  "method": [
    {
      "title": "Audit terrain",
      "text": "Nous parcourons le site dans l’ordre d’un visiteur : entrée, circulations, production, locaux techniques, locaux sociaux. 55 points de contrôle."
    },
    {
      "title": "Conception",
      "text": "Chaque message est dessiné pour son emplacement : pictogrammes ISO 7010, plans lisibles, cohérence avec l’identité du site."
    },
    {
      "title": "Déploiement",
      "text": "Mise en place zone par zone, avec des supports adaptés à l’environnement : bureaux, ateliers, extérieurs."
    },
    {
      "title": "Contrôle",
      "text": "Cotation Conforme · Non conforme · Sans objet. Chaque écart ouvre une action, avec un pilote et une échéance."
    }
  ],
  "library": [
    {
      "id": "signaletique-complementaire",
      "client": "commun",
      "chapter": "risques",
      "title": "Les messages essentiels, en français et en arabe",
      "need": "Identifier un danger, une interdiction ou un accès à préserver en quelques secondes.",
      "answer": "Six panneaux complémentaires associant pictogrammes et messages bilingues.",
      "deliverables": [
        "Dangers électriques et incendie",
        "Accès et issues de secours",
        "Chute d’objets"
      ],
      "images": [
        {
          "name": "danger-electrique",
          "caption": "Danger électrique",
          "type": "poster",
          "kind": "artwork",
          "zone": "electrique",
          "width": 2835,
          "height": 1418,
          "src": "assets/photos/commun/danger-electrique.webp",
          "full": "assets/photos/commun/danger-electrique-grand.webp"
        },
        {
          "name": "matieres-inflammables",
          "caption": "Matériaux combustibles et inflammables",
          "type": "poster",
          "kind": "artwork",
          "zone": "stockage",
          "width": 2835,
          "height": 1418,
          "src": "assets/photos/commun/matieres-inflammables.webp",
          "full": "assets/photos/commun/matieres-inflammables-grand.webp"
        },
        {
          "name": "issues-secours-degagees",
          "caption": "Issues de secours · Stockage interdit",
          "type": "poster",
          "kind": "artwork",
          "zone": "secours",
          "width": 2835,
          "height": 1418,
          "src": "assets/photos/commun/issues-secours-degagees.webp",
          "full": "assets/photos/commun/issues-secours-degagees-grand.webp"
        },
        {
          "name": "interdiction-fumer",
          "caption": "Interdiction de fumer",
          "type": "poster",
          "kind": "artwork",
          "zone": "incendie",
          "width": 2835,
          "height": 1418,
          "src": "assets/photos/commun/interdiction-fumer.webp",
          "full": "assets/photos/commun/interdiction-fumer-grand.webp"
        },
        {
          "name": "acces-reserve",
          "caption": "Accès interdit au personnel non autorisé",
          "type": "poster",
          "kind": "artwork",
          "zone": "site",
          "width": 2835,
          "height": 1418,
          "src": "assets/photos/commun/acces-reserve.webp",
          "full": "assets/photos/commun/acces-reserve-grand.webp"
        },
        {
          "name": "chute-objets",
          "caption": "Danger · Chute d’objets",
          "type": "poster",
          "kind": "artwork",
          "zone": "stockage",
          "width": 2835,
          "height": 1418,
          "src": "assets/photos/commun/chute-objets.webp",
          "full": "assets/photos/commun/chute-objets-grand.webp"
        }
      ]
    }
  ],
  "hero": [
    {
      "project": "tesca-services",
      "image": "plaques-services"
    },
    {
      "project": "tesca-bureaux",
      "image": "direction-finance-rh"
    },
    {
      "project": "tesca-panneaux-locaux",
      "image": "panneau-atelier-retordage"
    },
    {
      "project": "tesca-panneaux-locaux",
      "image": "panneau-traitement-air"
    },
    {
      "project": "tesca-panneaux-locaux",
      "image": "panneau-laboratoire-essais"
    },
    {
      "project": "tesca-risques",
      "image": "atelier-retordage-consignes"
    },
    {
      "project": "psc-risques",
      "image": "atelier-1-pose"
    },
    {
      "project": "socohuile-risques",
      "image": "hygiene-personnel"
    },
    {
      "project": "tesca-risques",
      "image": "consignes-chariots"
    },
    {
      "project": "tesca-evacuation",
      "image": "evacuation-entrepot"
    },
    {
      "project": "psc-evacuation",
      "image": "evacuation-atelier-1-pose"
    },
    {
      "project": "tesca-circulation",
      "image": "circulation-entrepot"
    }
  ]
};

window.KEYSAFE_UTILS = {
  mockupPath: (client, name) => `assets/mockups/${client}-${name}.svg`,
  photoBase: (client, name) => `assets/photos/${client}/${name}`,
  filterProjects(projects, { client = 'all', chapter = 'all', sub = 'all' } = {}) {
    return projects.filter(p =>
      (client === 'all' || p.client === client) &&
      (chapter === 'all' || p.chapter === chapter) &&
      (sub === 'all' || !p.sub || p.sub === sub));
  }
};
