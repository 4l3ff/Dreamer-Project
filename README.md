# 💪 Dreamer - Seu Companheiro de Treinos

Um Progressive Web App (PWA) completo e funcional para gerenciamento de treinos, totalmente offline.

## 🌟 Características

### ✅ Totalmente Offline
- **IndexedDB**: Todos os dados armazenados localmente
- **Service Worker**: Cache de assets para funcionamento offline
- **PWA**: Instalável no Android como aplicativo nativo

### 🎨 Design Moderno
- **Tema Escuro**: Interface elegante e confortável para os olhos
- **Cores**: Azul (#3b82f6) e Roxo (#8b5cf6) como destaques
- **Tipografia**: Space Grotesk para títulos, Inter para corpo
- **Layout Responsivo**: Mobile-first, otimizado para smartphones
- **Componentes Shadcn/UI**: Interface moderna e profissional

### 📱 Funcionalidades Principais

#### 1️⃣ Tela Início
- Estatísticas do período de 7 dias
- Histórico completo de treinos
- Indicadores de progresso (treinos, calorias, volume)
- Cards informativos com detalhes de cada treino

#### 2️⃣ Tela Treino
- **Início Rápido**: Comece um treino vazio rapidamente
- **Gerenciamento de Rotinas**: Crie, edite e organize rotinas
- **Pastas**: Organize rotinas em categorias personalizadas
- **Biblioteca de Exercícios**: Catálogo completo com imagens

#### 3️⃣ Tela Perfil
- Informações do usuário (peso, altura, idade)
- Estatísticas gerais (treinos totais, tempo, volume)
- **Gráficos de Progresso**: Visualização de linha do progresso
- **Medições Corporais**: Registro completo de medidas

#### 4️⃣ Treino Ativo
- Interface de execução de treino em tempo real
- **Cronômetro de Descanso Automático**: Inicia após série concluída
- Controles de pausa/despausar
- **Notificação Sonora e Vibração**: Alerta quando tempo de descanso termina
- Botões de finalizar e descartar treino
- Edição de séries em tempo real

#### 5️⃣ Configurações
- **Exportar Backup**: Salva todos os dados em JSON
- **Importar Backup**: Restaura dados de arquivo
- **Limpar Dados**: Remove todos os dados permanentemente
- Informações do app e créditos

### 🧮 Cálculos Inteligentes

#### Calorias
Fórmula matemática baseada em:
```
Calorias = (Volume total × 0.003) + (Minutos × Peso corporal × 0.1)
```

#### Volume Total
Calculado automaticamente a partir das séries completadas:
```
Volume = Σ (peso × repetições) para cada série completada
```

## 🏗️ Arquitetura Técnica

### Frontend
- **React 19**: Framework principal
- **React Router**: Navegação entre páginas
- **TailwindCSS**: Estilização moderna
- **Shadcn/UI**: Componentes reutilizáveis
- **Recharts**: Gráficos de progresso
- **Lucide React**: Ícones modernos
- **Sonner**: Notificações toast

### Armazenamento
- **IndexedDB**: Banco de dados local
- Stores:
  - `workouts`: Treinos realizados
  - `routines`: Rotinas de treino
  - `exercises`: Biblioteca de exercícios
  - `folders`: Pastas/categorias
  - `measurements`: Medições corporais
  - `userProfile`: Dados do usuário

### PWA
- **Service Worker**: Cache offline
- **Manifest**: Configuração de instalação
- **Icons**: Ícones adaptáveis para diferentes dispositivos

## 📂 Estrutura de Arquivos

```
/app/frontend/
├── public/
│   ├── manifest.json          # Configuração PWA
│   ├── service-worker.js      # Service Worker
│   └── index.html             # HTML principal
├── src/
│   ├── components/
│   │   ├── ui/                # Componentes Shadcn
│   │   └── BottomNav.js       # Navegação inferior
│   ├── contexts/
│   │   └── AppContext.js      # Context API global
│   ├── pages/
│   │   ├── Home.js            # Tela inicial
│   │   ├── Treino.js          # Tela de treino
│   │   ├── Profile.js         # Tela de perfil
│   │   ├── ActiveWorkout.js   # Treino em execução
│   │   ├── NewRoutine.js      # Criar/editar rotina
│   │   ├── ExerciseLibrary.js # Biblioteca de exercícios
│   │   ├── NewMeasurement.js  # Registrar medições
│   │   ├── EditProfile.js     # Editar perfil
│   │   ├── Settings.js        # Configurações
│   │   ├── FolderManagement.js # Gerenciar pastas
│   │   └── WorkoutDetails.js  # Detalhes do treino
│   ├── utils/
│   │   ├── db.js              # Funções IndexedDB
│   │   └── calculations.js    # Cálculos (calorias, volume)
│   ├── App.js                 # Componente principal
│   ├── App.css                # Estilos principais
│   ├── index.css              # Estilos globais
│   └── index.js               # Entry point
└── package.json               # Dependências
```

## 🚀 Como Usar

### Instalação
O app está rodando em: `http://localhost:3000`

### No Smartphone (Android)
1. Abra o app no navegador Chrome
2. Toque no menu (⋮)
3. Selecione "Adicionar à tela inicial"
4. O app será instalado como aplicativo nativo

### Funcionalidades Offline
Todas as funcionalidades funcionam 100% offline após a primeira visita.

## 🎯 Fluxo de Uso

### Criar Rotina
1. Ir para aba **Treino**
2. Clicar em **Nova Rotina**
3. Adicionar nome e pasta (opcional)
4. Adicionar exercícios da biblioteca
5. Configurar séries e tempo de descanso
6. Salvar rotina

### Executar Treino
1. Na aba **Treino**, clicar em **Iniciar** na rotina desejada
2. Ou usar **Início Rápido** para treino vazio
3. Adicionar exercícios conforme necessário
4. Marcar séries como concluídas
5. Cronômetro de descanso inicia automaticamente
6. Finalizar treino ao concluir

### Acompanhar Progresso
1. Na aba **Início**: Ver histórico e estatísticas
2. Na aba **Perfil**: Ver gráficos de progresso e estatísticas gerais
3. Adicionar medições corporais regularmente

### Backup de Dados
1. Ir para **Configurações** (ícone de engrenagem no perfil)
2. **Exportar Dados**: Salva arquivo JSON com todos os dados
3. **Importar Dados**: Restaura dados de um backup anterior

## 🎨 Paleta de Cores

- **Fundo Principal**: `#0a0a0b`
- **Fundo Secundário**: `#1a1a1b`
- **Fundo Terciário**: `#111`
- **Azul**: `#3b82f6`
- **Roxo**: `#8b5cf6`
- **Verde**: `#10b981`
- **Laranja**: `#f97316`
- **Vermelho**: `#ef4444`
- **Texto Principal**: `#ffffff`
- **Texto Secundário**: `#9ca3af`

## 📝 Notas Técnicas

### Persistência de Dados
- Todos os dados são salvos automaticamente
- Não há necessidade de conexão com servidor
- Backup manual disponível via JSON

### Performance
- Hot reload habilitado no desenvolvimento
- Build otimizado para produção
- Assets cacheados pelo Service Worker

### Compatibilidade
- Chrome/Edge (recomendado)
- Firefox
- Safari (funcionalidades PWA limitadas)
- Android (instalação nativa)
- iOS (sem instalação nativa completa)

## 🔧 Desenvolvimento

### Dependências Principais
```json
{
  "react": "^19.0.0",
  "react-router-dom": "^7.9.6",
  "tailwindcss": "^3.4.18",
  "lucide-react": "^0.507.0",
  "recharts": "^3.5.0",
  "sonner": "^2.0.7",
  "date-fns": "^4.1.0"
}
```

# 🚀 Guia Rápido de Git (Básico, NPM e Solução de Erros)

## ✅ Clonando o projeto em outro PC
1. Clone o repositório:  
`git clone https://github.com/4l3ff/Teste.git`
2. Entre na pasta do projeto:  
`cd Teste`
3. Instale dependências (NPM):  
`npm install`
4. Rode o projeto:  
`npm start`

## ✅ Enviando Alterações para o GitHub
Sempre que alterar arquivos no VS Code:

1. **Salvar arquivos**  
   Pressione `Ctrl + S` para salvar suas alterações.
2. **Adicionar arquivos ao Git**  
`git add .`  
   *Ou adicione arquivos específicos:*  
`git add caminho/do/arquivo`
3. **Criar um commit**  
`git commit -m "Mensagem descritiva do commit"`
4. **Enviar para o GitHub**  
`git push`

💡 Atalho pelo VS Code:  
- Clique no ícone de **Controle de Código-Fonte** 🌿  
- Clique em **+** nos arquivos alterados → escreva a mensagem do commit → clique em ✔ Commit → depois clique em **Sync Changes** ou **Push**

## ⚠️ Se der erro no push (“fetch first”)
Esse erro acontece quando o GitHub possui alterações que você ainda não tem localmente.

### 👉 Como resolver:
1. Atualize seu repositório local com rebase:  
`git pull --rebase`
2. Em seguida, envie novamente:  
`git push`

## 📝 Dicas e Observações
- **Não use rebase automaticamente**; utilize apenas quando o push for rejeitado.  
- Escreva mensagens de commit **claras e descritivas** — isso ajuda a manter o histórico organizado.  
- Sempre confirme o status dos arquivos antes do commit:  
`git status`  
- Se precisar desfazer alterações locais em um arquivo específico:  
`git checkout -- <arquivo>`  
- Este guia é um **resumo rápido** para consultas no dia a dia.

## 💡 Observações sobre NPM vs Yarn
- Comandos no NPM equivalentes ao Yarn:  
`npm start`      # yarn start  
`npm run build`  # yarn build  
`npm test`       # yarn test
- Arquivos `yarn.lock` não são necessários se você usa NPM, então podem ser ignorados ou removidos do repositório.

## 👨‍💻 Créditos

**Desenvolvido por**: TechnoSerp  
**Link**: [linktr.ee/technoserp](https://linktr.ee/technoserp)

---

**Dreamer** - Transforme seus sonhos fitness em realidade! 💪✨
