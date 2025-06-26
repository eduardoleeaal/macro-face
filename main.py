import json
import os
import subprocess
import threading
import tkinter as tk
from pathlib import Path
from tkinter import filedialog, messagebox

import customtkinter as ctk

# Configuração do tema
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")


class FacebookMarketplaceBot:
    def __init__(self):
        self.root = ctk.CTk()
        self.root.title("Facebook Marketplace Bot")
        self.root.geometry("800x700")
        self.root.resizable(True, True)

        # Variáveis
        self.selected_images = []
        self.config_file = "config.json"

        # Criar interface
        self.create_widgets()
        self.load_config()

    def create_widgets(self):
        # Título principal
        title_label = ctk.CTkLabel(
            self.root,
            text="🤖 Facebook Marketplace Bot",
            font=ctk.CTkFont(size=24, weight="bold")
        )
        title_label.pack(pady=20)

        # Frame principal com scroll
        main_frame = ctk.CTkScrollableFrame(self.root, width=750, height=600)
        main_frame.pack(pady=10, padx=20, fill="both", expand=True)

        # Seção de credenciais
        self.create_credentials_section(main_frame)

        # Seção de dados do produto
        self.create_product_section(main_frame)

        # Seção de imagens
        self.create_images_section(main_frame)

        # Seção de controles
        self.create_controls_section(main_frame)

    def create_credentials_section(self, parent):
        # Frame de credenciais
        cred_frame = ctk.CTkFrame(parent)
        cred_frame.pack(fill="x", pady=10, padx=10)

        ctk.CTkLabel(
            cred_frame,
            text="🔐 Credenciais do Facebook",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(pady=10)

        # Email
        ctk.CTkLabel(cred_frame, text="Email:").pack(anchor="w", padx=20)
        self.email_entry = ctk.CTkEntry(
            cred_frame, width=400, placeholder_text="seu.email@exemplo.com")
        self.email_entry.pack(pady=5, padx=20)

        # Senha
        ctk.CTkLabel(cred_frame, text="Senha:").pack(anchor="w", padx=20)
        self.password_entry = ctk.CTkEntry(
            cred_frame, width=400, show="*", placeholder_text="Sua senha")
        self.password_entry.pack(pady=5, padx=20)

    def create_product_section(self, parent):
        # Frame de produto
        product_frame = ctk.CTkFrame(parent)
        product_frame.pack(fill="x", pady=10, padx=10)

        ctk.CTkLabel(
            product_frame,
            text="📦 Dados do Produto",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(pady=10)

        # Título do produto
        ctk.CTkLabel(product_frame, text="Título do Produto:").pack(
            anchor="w", padx=20)
        self.title_entry = ctk.CTkEntry(
            product_frame, width=400, placeholder_text="Ex: Notebook Gamer i7 16GB RAM")
        self.title_entry.pack(pady=5, padx=20)

        # Preço
        ctk.CTkLabel(product_frame, text="Preço (R$):").pack(
            anchor="w", padx=20)
        self.price_entry = ctk.CTkEntry(
            product_frame, width=400, placeholder_text="Ex: 3500")
        self.price_entry.pack(pady=5, padx=20)

        # Categoria
        ctk.CTkLabel(product_frame, text="Categoria:").pack(
            anchor="w", padx=20)
        self.category_var = ctk.StringVar(value="Eletrônicos")
        self.category_combo = ctk.CTkComboBox(
            product_frame,
            width=400,
            values=["Eletrônicos", "Móveis", "Roupas", "Carros",
                    "Imóveis", "Esportes", "Livros", "Outros"],
            variable=self.category_var
        )
        self.category_combo.pack(pady=5, padx=20)

        # Descrição
        ctk.CTkLabel(product_frame, text="Descrição:").pack(
            anchor="w", padx=20)
        self.description_text = ctk.CTkTextbox(
            product_frame, width=400, height=100)
        self.description_text.pack(pady=5, padx=20)

    def create_images_section(self, parent):
        # Frame de imagens
        images_frame = ctk.CTkFrame(parent)
        images_frame.pack(fill="x", pady=10, padx=10)

        ctk.CTkLabel(
            images_frame,
            text="🖼️ Imagens do Produto",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(pady=10)

        # Botão para selecionar imagens
        select_btn = ctk.CTkButton(
            images_frame,
            text="📁 Selecionar Imagens",
            command=self.select_images,
            width=200
        )
        select_btn.pack(pady=10)

        # Lista de imagens selecionadas
        self.images_listbox = tk.Listbox(images_frame, height=6, width=60)
        self.images_listbox.pack(pady=10, padx=20)

        # Botão para remover imagem selecionada
        remove_btn = ctk.CTkButton(
            images_frame,
            text="🗑️ Remover Selecionada",
            command=self.remove_selected_image,
            width=200,
            fg_color="red",
            hover_color="darkred"
        )
        remove_btn.pack(pady=5)

    def create_controls_section(self, parent):
        # Frame de controles
        controls_frame = ctk.CTkFrame(parent)
        controls_frame.pack(fill="x", pady=10, padx=10)

        ctk.CTkLabel(
            controls_frame,
            text="⚙️ Controles",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(pady=10)

        # Checkbox para modo headless
        self.headless_var = ctk.BooleanVar(value=False)
        headless_check = ctk.CTkCheckBox(
            controls_frame,
            text="Executar em modo invisível (headless)",
            variable=self.headless_var
        )
        headless_check.pack(pady=5)

        # Delay entre ações
        ctk.CTkLabel(controls_frame, text="Delay entre ações (segundos):").pack(
            anchor="w", padx=20)
        self.delay_entry = ctk.CTkEntry(
            controls_frame, width=200, placeholder_text="2")
        self.delay_entry.pack(pady=5)

        # Botões principais
        buttons_frame = ctk.CTkFrame(controls_frame)
        buttons_frame.pack(pady=20, fill="x")

        # Botão para salvar configurações
        save_btn = ctk.CTkButton(
            buttons_frame,
            text="💾 Salvar Configurações",
            command=self.save_config,
            width=200
        )
        save_btn.pack(side="left", padx=10)

        # Botão para executar bot
        self.run_btn = ctk.CTkButton(
            buttons_frame,
            text="🚀 Executar Bot",
            command=self.run_bot,
            width=200,
            fg_color="green",
            hover_color="darkgreen"
        )
        self.run_btn.pack(side="right", padx=10)

        # Log de status
        ctk.CTkLabel(controls_frame, text="📊 Log de Status:").pack(
            anchor="w", padx=20, pady=(20, 0))
        self.log_text = ctk.CTkTextbox(controls_frame, width=400, height=100)
        self.log_text.pack(pady=5, padx=20)

    def select_images(self):
        files = filedialog.askopenfilenames(
            title="Selecionar Imagens",
            filetypes=[
                ("Imagens", "*.jpg *.jpeg *.png *.gif *.bmp"),
                ("Todos os arquivos", "*.*")
            ]
        )

        for file in files:
            if file not in self.selected_images:
                self.selected_images.append(file)
                self.images_listbox.insert(tk.END, os.path.basename(file))

    def remove_selected_image(self):
        selection = self.images_listbox.curselection()
        if selection:
            index = selection[0]
            self.images_listbox.delete(index)
            del self.selected_images[index]

    def log_message(self, message):
        self.log_text.insert("end", f"{message}\n")
        self.log_text.see("end")
        self.root.update()

    def save_config(self):
        config = {
            "email": self.email_entry.get(),
            "title": self.title_entry.get(),
            "price": self.price_entry.get(),
            "category": self.category_var.get(),
            "description": self.description_text.get("1.0", "end-1c"),
            "delay": self.delay_entry.get() or "2"
        }

        try:
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(config, f, ensure_ascii=False, indent=2)
            messagebox.showinfo("Sucesso", "Configurações salvas com sucesso!")
        except Exception as e:
            messagebox.showerror(
                "Erro", f"Erro ao salvar configurações: {str(e)}")

    def load_config(self):
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    config = json.load(f)

                self.email_entry.insert(0, config.get("email", ""))
                self.title_entry.insert(0, config.get("title", ""))
                self.price_entry.insert(0, config.get("price", ""))
                self.category_var.set(config.get("category", "Eletrônicos"))
                self.description_text.insert(
                    "1.0", config.get("description", ""))
                self.delay_entry.insert(0, config.get("delay", "2"))
        except Exception as e:
            self.log_message(f"Erro ao carregar configurações: {str(e)}")

    def validate_inputs(self):
        if not self.email_entry.get():
            messagebox.showerror("Erro", "Email é obrigatório!")
            return False

        if not self.password_entry.get():
            messagebox.showerror("Erro", "Senha é obrigatória!")
            return False

        if not self.title_entry.get():
            messagebox.showerror("Erro", "Título do produto é obrigatório!")
            return False

        if not self.price_entry.get():
            messagebox.showerror("Erro", "Preço é obrigatório!")
            return False

        if not self.selected_images:
            messagebox.showerror("Erro", "Selecione pelo menos uma imagem!")
            return False

        return True

    def run_bot(self):
        if not self.validate_inputs():
            return

        # Executar em thread separada para não travar a interface
        thread = threading.Thread(target=self.execute_automation)
        thread.daemon = True
        thread.start()

    def execute_automation(self):
        try:
            self.run_btn.configure(state="disabled", text="🔄 Executando...")
            self.log_message("Iniciando automação...")

            # Criar arquivo temporário com dados
            data = {
                "email": self.email_entry.get(),
                "password": self.password_entry.get(),
                "title": self.title_entry.get(),
                "price": self.price_entry.get(),
                "category": self.category_var.get(),
                "description": self.description_text.get("1.0", "end-1c"),
                "images": self.selected_images,
                "headless": self.headless_var.get(),
                "delay": int(self.delay_entry.get() or "2")
            }

            with open("temp_data.json", "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

            self.log_message("Dados salvos, executando script Node.js...")

            # Executar script Node.js
            result = subprocess.run(
                ["node", "facebook_bot.js"],
                capture_output=True,
                text=True,
                encoding="utf-8"
            )

            if result.returncode == 0:
                self.log_message("✅ Automação concluída com sucesso!")
                self.log_message(result.stdout)
            else:
                self.log_message("❌ Erro na automação:")
                self.log_message(result.stderr)

        except Exception as e:
            self.log_message(f"❌ Erro: {str(e)}")
        finally:
            self.run_btn.configure(state="normal", text="🚀 Executar Bot")
            # Limpar arquivo temporário
            if os.path.exists("temp_data.json"):
                os.remove("temp_data.json")

    def run(self):
        self.root.mainloop()


if __name__ == "__main__":
    app = FacebookMarketplaceBot()
    app.run()
