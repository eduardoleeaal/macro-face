# Facebook Marketplace Bot

Este é um programa completo com interface gráfica para automatizar a criação de anúncios no Facebook Marketplace.

## 🚀 Funcionalidades

- **Interface moderna** com CustomTkinter
- **Login automático** no Facebook
- **Preenchimento automático** de dados do produto
- **Upload múltiplo** de imagens
- **Configurações personalizáveis** (delay, modo headless)
- **Sistema de logs** em tempo real
- **Salvamento de configurações**
- **Validação de dados** antes da execução

## 📋 Requisitos

### Python
- Python 3.8 ou superior
- CustomTkinter
- Pillow

### Node.js
- Node.js 16 ou superior
- Puppeteer

## 🛠️ Instalação

### 1. Instalar dependências Python
```bash
pip install -r requirements.txt
```

### 2. Instalar dependências Node.js
```bash
npm install
```

## 📖 Como usar

### 1. Executar o programa
```bash
python main.py
```

### 2. Configurar credenciais
- Insira seu email e senha do Facebook
- **IMPORTANTE**: Use por sua conta e risco

### 3. Preencher dados do produto
- **Título**: Nome do produto
- **Preço**: Valor em reais (apenas números)
- **Categoria**: Selecione a categoria apropriada
- **Descrição**: Descrição detalhada do produto

### 4. Selecionar imagens
- Clique em "Selecionar Imagens"
- Escolha múltiplas imagens do produto
- Formatos suportados: JPG, PNG, GIF, BMP

### 5. Configurar execução
- **Modo invisível**: Execute sem mostrar o navegador
- **Delay**: Tempo entre ações (recomendado: 2-3 segundos)

### 6. Executar automação
- Clique em "Executar Bot"
- Acompanhe o progresso no log
- **O anúncio NÃO será publicado automaticamente**

## ⚙️ Funcionalidades técnicas

### Interface Python (main.py)
- Interface gráfica moderna com CustomTkinter
- Validação de dados de entrada
- Sistema de configurações persistentes
- Logs em tempo real
- Gerenciamento de múltiplas imagens

### Bot JavaScript (facebook_bot.js)
- Automação com Puppeteer
- Múltiplos seletores para compatibilidade
- Tratamento de erros robusto
- Upload inteligente de imagens
- Digitação natural para evitar detecção

## 🔧 Configurações avançadas

### Delays personalizados
Ajuste o delay entre ações para evitar detecção:
- **Rápido**: 1-2 segundos
- **Normal**: 2-3 segundos  
- **Seguro**: 3-5 segundos

### Modo headless
- **Ativado**: Execução invisível, mais rápida
- **Desativado**: Mostra o navegador, permite supervisão

## 🚨 Avisos importantes

1. **Segurança**: O programa não envia anúncios automaticamente
2. **Responsabilidade**: Use por sua conta e risco
3. **Termos**: Respeite os termos de uso do Facebook
4. **Detecção**: Use delays adequados para evitar bloqueios
5. **Credenciais**: Suas credenciais ficam apenas no seu computador

## 🐛 Solução de problemas

### Erro de login
- Verifique email e senha
- Resolva desafios de segurança manualmente
- Tente usar modo não-headless para ver o que acontece

### Campos não encontrados
- O Facebook pode ter mudado a interface
- Tente aguardar mais tempo (aumente o delay)
- Execute em modo não-headless para debug

### Upload de imagens falha
- Verifique se os arquivos existem
- Confirme os formatos (JPG, PNG, GIF, BMP)
- Reduza o número de imagens por vez

### Puppeteer não funciona
```bash
# Reinstalar Puppeteer
npm uninstall puppeteer
npm install puppeteer
```

## 📁 Estrutura do projeto

```
facebook-marketplace-bot/
├── main.py              # Interface gráfica principal
├── facebook_bot.js      # Script de automação
├── package.json         # Dependências Node.js
├── requirements.txt     # Dependências Python
├── config.json         # Configurações salvas (criado automaticamente)
└── README.md           # Este arquivo
```

## 🔄 Atualizações futuras

- [ ] Suporte a mais categorias
- [ ] Agendamento de anúncios
- [ ] Templates de descrição
- [ ] Processamento de imagens
- [ ] Relatórios de automação
- [ ] Integração com APIs

## ⚖️ Licença

Este projeto é fornecido "como está" para fins educacionais. Use com responsabilidade e respeite os termos de serviço das plataformas utilizadas.

---

**Desenvolvido com ❤️ para automação responsável**
