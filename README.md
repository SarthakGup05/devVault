# DevVault 🛡️💻

DevVault is a state-of-the-art, **offline-first secure code ledger** and snippet manager built with **Expo**, **React Native**, and **TypeScript**. Centered around the premium **Catppuccin Mocha Dark theme**, it provides developers with a high-fidelity, micro-animated code library featuring a unified multi-provider AI assistant, resilient network gateways, and rich tactile interactions.

---

## 🏗️ Architecture & Data Flow

Below is the high-fidelity flowchart illustrating DevVault's layout architecture, SQLite ledger synchronization, automatic multi-LLM routing, and self-healing API gateway.

```mermaid
graph TD
    %% Define styles & themes
    classDef default fill:#313244,stroke:#45475A,stroke-width:1.5px,color:#CDD6F4,font-family:'Segoe UI',font-size:12px;
    classDef highlight fill:#89B4FA,stroke:#74C7EC,stroke-width:2px,color:#1E1E2E,font-family:'Segoe UI',font-size:13px,font-weight:bold;
    classDef accent fill:#F5C2E7,stroke:#CBA6F7,stroke-width:1.5px,color:#1E1E2E,font-family:'Segoe UI',font-size:12px,font-weight:bold;
    classDef database fill:#A6E3A1,stroke:#94E2D5,stroke-width:1.5px,color:#1E1E2E,font-family:'Segoe UI',font-size:12px,font-weight:bold;
    classDef error fill:#F38BA8,stroke:#E78284,stroke-width:1.5px,color:#1E1E2E,font-family:'Segoe UI',font-size:12px;

    %% Elements
    User([User Interactive UI]) ::: highlight
    TouchableScale[TouchableScale Spring Touch Engine] ::: accent
    HomeScreen[HomeScreen Dashboard Ledger] ::: default
    CodeEditor[CodeEditor Transparent Multi-Overlay] ::: default
    Input[Input Focus Glow Control] ::: default
    Notification[Spring-Animated Global Toast Notification] ::: accent
    SQLite[(Offline SQLite Database Ledger)] ::: database
    AIRouter{Flexible API Key Gateway Router} ::: default
    Gemini[Gemini 2.5 Active Model] ::: default
    OpenAI[OpenAI / GPT-4o-mini] ::: default
    Claude[Claude 3.5 Haiku] ::: default
    FetchRetry{Resilient fetchWithRetry Wrapper} ::: accent
    Backoff[Exponential Backoff Wait - 1s, 2s, 4s] ::: accent
    Success([Suggestion Ghost-Text Overlay]) ::: database
    Fail([Elegantly Display Smooth Error Banner]) ::: error

    %% Flow lines
    User -->|Tactile Press & Haptic Impact| TouchableScale
    TouchableScale --> HomeScreen
    TouchableScale --> CodeEditor
    TouchableScale --> Input
    
    HomeScreen <-->|Load & Save Local Ledger| SQLite
    
    CodeEditor -->|Trigger Debounced Suggestion| AIRouter
    CodeEditor -->|Render Custom Highlight CodeTag| Success
    
    AIRouter -->|API Key starts with AIzaSy| Gemini
    AIRouter -->|API Key starts with sk-ant-| Claude
    AIRouter -->|API Key starts with sk- or other| OpenAI
    
    Gemini & Claude & OpenAI --> FetchRetry
    
    FetchRetry -->|HTTP Status 200 OK| Success
    FetchRetry -->|HTTP Status 503 / 429 / Network Drop| Backoff
    Backoff -->|Retry Attempt <= 3| FetchRetry
    Backoff -->|Retry Attempts Exhausted| Fail
    
    Success -->|Sparkling notification toast| Notification
    Fail -->|Warning notification toast| Notification
```

---

## 🎨 Premium Visual Elements

DevVault achieves a high-fidelity visual experience through tailored animations and custom interaction wrappers:

1. **TouchableScale Interactive Core** (`TouchableScale.tsx`): Overhauls traditional pressing states into a bouncy spring-scaling animation (`friction: 8, tension: 150`). It is fully integrated into search clear triggers, list ledger entries, header actions, and settings.
2. **Tactile Haptic Feedback**: Triggers distinct `expo-haptics` impact feedback patterns (selection ticks, light, medium, or warnings) automatically depending on interaction severity.
3. **Staggered Entry timing**: Ledger snippet card lists sequentialize their entry using timing offsets (`Math.min(index * 45, 600)`), sliding up (`translateY: 15` to `0`) and fading in smoothly using native thread drivers.
4. **Organic Glowing Fields** (`Input.tsx`): Text inputs animate their border color, outline width, and shadow radius dynamically on focus, drawing the user seamlessly into input states.
5. **Breathing AI Autocomplete Pill**: The floating "Tab to Accept" autocomplete indicator pulses softly in a scale loop (`0.98` to `1.05` scale duration) to guide interaction.
6. **Resilient AI Gateways**: Built-in exponential backoff retry algorithms gracefully handle transient network drops or HTTP overload codes (`503`, `429`) quietly in the background.

---

## 🚀 Getting Started

### 1. Installation

Install all required NPM modules and visual dependencies:
```bash
npm install
```

### 2. Launch Local Servers

Start the local Expo development bundler:
```bash
npx expo start
```

Press `a` to load in Android emulators, `i` to compile in iOS simulators, or scan the QR code to run natively using Expo Go on your mobile device.

### 3. Run Validation Checks

Ensure all components and screens build clean under strict TypeScript constraints:
```bash
npx tsc --noEmit
```
