# Configuração de imagens de exemplo
# Adicione aqui os caminhos para suas imagens de teste
IMAGES_EXEMPLO = [
    "C:\\Users\\LEAL\\Pictures\\produto1.jpg",
    "C:\\Users\\LEAL\\Pictures\\produto2.jpg",
    "C:\\Users\\LEAL\\Pictures\\produto3.jpg"
]

# Configurações de segurança
DELAY_MINIMO = 1  # segundos
DELAY_MAXIMO = 10  # segundos
MAX_IMAGENS = 10

# Seletores alternativos para diferentes versões do Facebook
FACEBOOK_SELECTORS = {
    "titulo": [
        'input[aria-label="Título"]',
        'input[aria-label="Title"]',
        'input[placeholder*="título"]',
        'input[placeholder*="Title"]',
        'input[name="title"]',
        'textarea[aria-label="Título"]'
    ],
    "preco": [
        'input[aria-label="Preço"]',
        'input[aria-label="Price"]',
        'input[placeholder*="preço"]',
        'input[placeholder*="Price"]',
        'input[name="price"]',
        'input[type="number"]'
    ],
    "descricao": [
        'textarea[aria-label="Descrição"]',
        'textarea[aria-label="Description"]',
        'textarea[placeholder*="descrição"]',
        'textarea[placeholder*="Description"]',
        'textarea[name="description"]',
        'div[contenteditable="true"]'
    ],
    "arquivo": [
        'input[type="file"]',
        'input[accept*="image"]',
        'input[multiple]'
    ]
}
