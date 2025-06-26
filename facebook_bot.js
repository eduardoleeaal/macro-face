const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Função para aguardar um tempo específico
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Função para aguardar elemento aparecer na página
const waitForElementSafe = async (page, selector, timeout = 10000) => {
    try {
        await page.waitForSelector(selector, { timeout });
        return true;
    } catch (error) {
        console.log(`Elemento ${selector} não encontrado: ${error.message}`);
        return false;
    }
};

// Função para digitar texto de forma mais natural
const typeNaturally = async (page, selector, text, delayMs = 100) => {
    await page.focus(selector);
    await page.keyboard.type(text, { delay: delayMs });
};

// Função para debug - listar todos os elementos da página
const debugPageElements = async (page) => {
    console.log('🔍 Debug: Analisando elementos da página...');
    
    try {
        const elements = await page.evaluate(() => {
            const inputs = Array.from(document.querySelectorAll('input, textarea, div[contenteditable="true"]'));
            return inputs.map(el => ({
                tag: el.tagName,
                type: el.type || 'N/A',
                id: el.id || 'N/A',
                name: el.name || 'N/A',
                ariaLabel: el.getAttribute('aria-label') || 'N/A',
                placeholder: el.placeholder || 'N/A',
                className: el.className || 'N/A',
                text: (el.textContent || el.value || '').substring(0, 50)
            }));
        });
        
        console.log(`📊 Encontrados ${elements.length} elementos interativos:`);
        elements.forEach((el, i) => {
            if (i < 10) { // Mostrar apenas os primeiros 10
                console.log(`   ${i + 1}. ${el.tag}[${el.type}] - Label:"${el.ariaLabel}" - Placeholder:"${el.placeholder}" - Text:"${el.text}"`);
            }
        });
        
        if (elements.length > 10) {
            console.log(`   ... e mais ${elements.length - 10} elementos`);
        }
        
    } catch (error) {
        console.log('❌ Erro ao analisar elementos:', error.message);
    }
};

async function automateMarketplace() {
    let browser;
    let data;
    
    try {
        // Carregar dados do arquivo temporário
        console.log('📖 Carregando dados...');
        const dataFile = fs.readFileSync('temp_data.json', 'utf8');
        data = JSON.parse(dataFile);
        
        console.log('🚀 Iniciando browser...');
        browser = await puppeteer.launch({ 
            headless: data.headless ? "new" : false,
            defaultViewport: null,
            args: [
                '--start-maximized',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-blink-features=AutomationControlled',
                '--disable-features=VizDisplayCompositor'
            ]
        });
        
        const page = await browser.newPage();
        
        // Configurar user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        console.log('🌐 Acessando Facebook...');
        await page.goto('https://www.facebook.com/login', { waitUntil: 'networkidle2' });
        
        // Fazer login
        console.log('🔐 Fazendo login...');
        await delay(data.delay * 1000);
        
        // Aguardar campos de login
        const emailFound = await waitForElementSafe(page, '#email');
        if (!emailFound) {
            throw new Error('Campo de email não encontrado');
        }
        
        await typeNaturally(page, '#email', data.email);
        await delay(500);
        await typeNaturally(page, '#pass', data.password);
        await delay(500);
        
        await page.click('button[name="login"]');
        console.log('⏳ Aguardando login...');
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
        
        await delay(data.delay * 1000);
        
        // Verificar se o login foi bem-sucedido
        const currentUrl = page.url();
        if (currentUrl.includes('login') || currentUrl.includes('checkpoint')) {
            throw new Error('Falha no login. Verifique suas credenciais ou resolva desafios de segurança manualmente.');
        }
        
        console.log('✅ Login realizado com sucesso!');
        
        // Acessar Marketplace
        console.log('🏪 Acessando Marketplace...');
        await page.goto('https://www.facebook.com/marketplace/create/item', { waitUntil: 'networkidle2' });
        
        await delay(data.delay * 2000); // Aguardar mais tempo para carregar
        
        // Aguardar página do Marketplace carregar
        console.log('⏳ Aguardando formulário carregar...');
        
        // Aguardar elementos da página carregarem
        await page.waitForTimeout(5000);
        
        // Tentar aguardar qualquer formulário aparecer
        try {
            await page.waitForSelector('form, [role="main"], [data-testid]', { timeout: 10000 });
            console.log('✅ Página base carregada');
        } catch (e) {
            console.log('⚠️ Página pode não ter carregado completamente');
        }
        
        // Tentar diferentes seletores para o título
        const titleSelectors = [
            'input[aria-label*="Título"], input[aria-label*="Title"]',
            'input[placeholder*="título"], input[placeholder*="Title"]', 
            'input[placeholder*="título"], input[placeholder*="title"]',
            'textarea[aria-label*="Título"], textarea[aria-label*="Title"]',
            'input[name="title"]',
            'input[data-testid*="title"]',
            'div[contenteditable="true"][aria-label*="Título"]',
            'div[contenteditable="true"][placeholder*="título"]',
            // Seletores mais genéricos
            'input[type="text"]:not([aria-label*="email"]):not([aria-label*="senha"])',
            'textarea:first-of-type'
        ];
        
        let titleSelector = null;
        console.log('🔍 Procurando campo de título...');
        
        for (let i = 0; i < titleSelectors.length; i++) {
            const selector = titleSelectors[i];
            console.log(`   Tentando seletor ${i + 1}/${titleSelectors.length}: ${selector}`);
            
            const found = await waitForElementSafe(page, selector, 3000);
            if (found) {
                titleSelector = selector;
                console.log(`✅ Campo de título encontrado: ${selector}`);
                break;
            }
        }
        
        if (!titleSelector) {
            console.log('❌ Campo de título não encontrado. Executando debug...');
            
            // Executar debug para ver elementos disponíveis
            await debugPageElements(page);
            
            // Tentar fazer screenshot para debug
            try {
                await page.screenshot({ path: 'debug_marketplace.png', fullPage: true });
                console.log('📸 Screenshot salvo como debug_marketplace.png');
            } catch (e) {
                console.log('⚠️ Não foi possível salvar screenshot');
            }
            
            // Aguardar mais tempo e tentar novamente
            console.log('⏳ Aguardando mais 10 segundos...');
            await delay(10000);
            
            // Tentar seletores mais genéricos
            const genericSelectors = [
                'input[type="text"]',
                'textarea',
                'div[contenteditable="true"]'
            ];
            
            for (const selector of genericSelectors) {
                const elements = await page.$$(selector);
                if (elements.length > 0) {
                    console.log(`🔍 Encontrados ${elements.length} elementos do tipo: ${selector}`);
                    
                    // Tentar o primeiro elemento que não seja de login
                    for (let i = 0; i < Math.min(elements.length, 3); i++) {
                        try {
                            const element = elements[i];
                            const text = await element.evaluate(el => el.textContent || el.value || el.placeholder || '');
                            console.log(`   Elemento ${i + 1}: "${text}"`);
                            
                            // Se parecer um campo de título, usar este
                            if (!text.toLowerCase().includes('email') && 
                                !text.toLowerCase().includes('senha') && 
                                !text.toLowerCase().includes('password')) {
                                titleSelector = selector;
                                console.log(`✅ Usando elemento genérico: ${selector}`);
                                break;
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                    if (titleSelector) break;
                }
            }
        }
        
        if (!titleSelector) {
            console.log('❌ Impossível encontrar campo de título. Possíveis causas:');
            console.log('   1. Página não carregou completamente');
            console.log('   2. Facebook mudou interface');
            console.log('   3. Captcha ou verificação pendente');
            console.log('   4. Problema de conectividade');
            
            if (!data.headless) {
                console.log('');
                console.log('🖥️ O navegador ficará aberto para investigação manual.');
                console.log('   Verifique se você está logado e na página correta.');
                await new Promise(() => {}); // Aguardar indefinidamente
            }
            
            throw new Error('Campo de título não encontrado após múltiplas tentativas');
        }
        
        // Preencher título
        console.log('📝 Preenchendo título...');
        await page.focus(titleSelector);
        await page.keyboard.selectAll();
        await typeNaturally(page, titleSelector, data.title);
        await delay(1000);
        
        // Preencher preço
        console.log('💰 Preenchendo preço...');
        const priceSelectors = [
            'input[aria-label*="Preço"], input[aria-label*="Price"]',
            'input[placeholder*="preço"], input[placeholder*="Price"]',
            'input[placeholder*="preço"], input[placeholder*="price"]',
            'input[name="price"]',
            'input[type="number"]',
            'input[data-testid*="price"]'
        ];
        
        let priceSelector = null;
        for (const selector of priceSelectors) {
            const found = await waitForElementSafe(page, selector, 3000);
            if (found) {
                priceSelector = selector;
                console.log(`✅ Campo de preço encontrado: ${selector}`);
                break;
            }
        }
        
        if (priceSelector) {
            await page.focus(priceSelector);
            await page.keyboard.selectAll();
            await typeNaturally(page, priceSelector, data.price);
            await delay(1000);
        } else {
            console.log('⚠️ Campo de preço não encontrado - tentando continuar...');
        }
        
        // Preencher descrição
        console.log('📋 Preenchendo descrição...');
        const descriptionSelectors = [
            'textarea[aria-label*="Descrição"], textarea[aria-label*="Description"]',
            'textarea[placeholder*="descrição"], textarea[placeholder*="Description"]',
            'textarea[placeholder*="descrição"], textarea[placeholder*="description"]',
            'textarea[name="description"]',
            'div[contenteditable="true"][aria-label*="Descrição"]',
            'div[contenteditable="true"][placeholder*="descrição"]',
            'textarea[data-testid*="description"]',
            'textarea:not([aria-label*="title"]):not([aria-label*="Título"])'
        ];
        
        let descriptionSelector = null;
        for (const selector of descriptionSelectors) {
            const found = await waitForElementSafe(page, selector, 3000);
            if (found) {
                descriptionSelector = selector;
                console.log(`✅ Campo de descrição encontrado: ${selector}`);
                break;
            }
        }
        
        if (descriptionSelector) {
            await page.focus(descriptionSelector);
            if (descriptionSelector.includes('div')) {
                // Para elementos contenteditable
                await page.evaluate((selector, text) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        element.textContent = text;
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }, descriptionSelector, data.description);
            } else {
                await page.keyboard.selectAll();
                await typeNaturally(page, descriptionSelector, data.description);
            }
            await delay(1000);
        } else {
            console.log('⚠️ Campo de descrição não encontrado - tentando continuar...');
        }
        
        // Upload de imagens
        if (data.images && data.images.length > 0) {
            console.log('🖼️ Fazendo upload das imagens...');
            
            const fileInputSelectors = [
                'input[type="file"]',
                'input[accept*="image"]',
                'input[multiple]'
            ];
            
            let fileInput = null;
            for (const selector of fileInputSelectors) {
                try {
                    fileInput = await page.$(selector);
                    if (fileInput) break;
                } catch (e) {
                    continue;
                }
            }
            
            if (fileInput) {
                // Verificar se todas as imagens existem
                const validImages = [];
                for (const imagePath of data.images) {
                    if (fs.existsSync(imagePath)) {
                        validImages.push(imagePath);
                    } else {
                        console.log(`⚠️ Imagem não encontrada: ${imagePath}`);
                    }
                }
                
                if (validImages.length > 0) {
                    console.log(`📸 Uploading ${validImages.length} imagens...`);
                    await fileInput.uploadFile(...validImages);
                    
                    // Aguardar upload das imagens
                    console.log('⏳ Aguardando upload das imagens...');
                    await delay(validImages.length * 2000); // 2 segundos por imagem
                    
                    console.log('✅ Upload de imagens concluído!');
                } else {
                    console.log('❌ Nenhuma imagem válida encontrada');
                }
            } else {
                console.log('⚠️ Campo de upload de imagens não encontrado');
            }
        }
        
        // Aguardar um pouco antes de finalizar
        await delay(3000);
        
        console.log('✅ Anúncio preenchido com sucesso!');
        console.log('📋 Resumo:');
        console.log(`   📝 Título: ${data.title}`);
        console.log(`   💰 Preço: R$ ${data.price}`);
        console.log(`   🗂️ Categoria: ${data.category}`);
        console.log(`   🖼️ Imagens: ${data.images ? data.images.length : 0}`);
        console.log('');
        console.log('🚨 IMPORTANTE: Revise todas as informações antes de publicar!');
        console.log('🚨 O anúncio NÃO foi enviado automaticamente por segurança.');
        
        if (!data.headless) {
            console.log('');
            console.log('🖥️ O navegador permanecerá aberto para revisão.');
            console.log('   Pressione Ctrl+C no terminal para fechar quando terminar.');
            
            // Manter o navegador aberto se não for headless
            await new Promise(() => {}); // Aguardar indefinidamente
        }
        
    } catch (error) {
        console.error('❌ Erro durante a automação:', error.message);
        
        if (error.message.includes('net::ERR_INTERNET_DISCONNECTED')) {
            console.error('🌐 Erro de conexão com a internet');
        } else if (error.message.includes('timeout')) {
            console.error('⏰ Timeout - a página demorou muito para carregar');
        } else if (error.message.includes('login')) {
            console.error('🔐 Erro de login - verifique suas credenciais');
        }
        
        process.exit(1);
    } finally {
        if (data && data.headless && browser) {
            await browser.close();
        }
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    automateMarketplace();
}

module.exports = automateMarketplace;
