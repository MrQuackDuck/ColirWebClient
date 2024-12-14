<h1><img src="https://i.imgur.com/r9MjrFQ.png" height=80 /><div>Colir (Web Client)</div></h1>
<p>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-gray?color=0B1121&logo=react&logoColor=00D1F7" /></a>
  <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-gray?color=0B1121&logo=vite&logoColor=64A5FF" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-gray?color=0B1121&logo=tailwindcss" /></a>
  <a href="https://ui.shadcn.com/"><img src="https://img.shields.io/badge/shadcn-gray?color=000000&logo=shadcnui" /></a>
  <a href="https://feature-sliced.design/"><img src="https://img.shields.io/badge/FSD-gray?color=0D1117" /></a>
  <a href="https://www.npmjs.com/package/@microsoft/signalr"><img src="https://img.shields.io/badge/SignalR-gray?color=4C9CC7&logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iNzUwIiBoZWlnaHQ9Ijc1MCIgdmlld0JveD0iMCAwIDc1MCA3NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zMDUuNjgyIDU0NS40NTVMMzQ3LjcyNyA0NDMuMTgySDQ0Mi4wNDVDNDc5LjU0NiA0NDMuMTgyIDUxMC4yMjcgNDEyLjUgNTEwLjIyNyAzNzVDNTEwLjIyNyAzMzcuNSA0NzkuNTQ2IDMwNi44MTggNDQyLjA0NSAzMDYuODE4SDEzNS4yMjdMMzA1LjY4MiAxMzYuMzY0VjIwNC41NDVINDQyLjA0NUM1MzYuMzYzIDIwNC41NDUgNjEyLjUgMjgwLjY4MSA2MTIuNSAzNzVDNjEyLjUgNDY3LjA0NSA1MzkuNzczIDU0MC45MDkgNDUwIDU0NC4zMThMNTg4LjYzNyA2ODIuOTU0QzY4Ni4zNjQgNjE0Ljc3MiA3NTAgNTAyLjI3MyA3NTAgMzc1Qzc1MCAxNjguMTgyIDU4MS44MTggMCAzNzUgMEMxNjguMTgyIDAgMCAxNjguMTgyIDAgMzc1QzAgNTgxLjgxOCAxNjguMTgyIDc1MCAzNzUgNzUwQzQxNS45MDkgNzUwIDQ1NS42ODIgNzQzLjE4MiA0OTIuMDQ2IDczMC42ODFMMzA1LjY4MiA1NDUuNDU1WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==" /></a>
  <a href="https://zod.dev/"><img src="https://img.shields.io/badge/Zod-gray?color=2A548F&logo=zod" /></a>
  <a href="https://axios-http.com/docs/intro"><img src="https://img.shields.io/badge/Axios-gray?color=814CCD&logo=axios" /></a>
  <a href="https://pages.github.com/"><img src="https://img.shields.io/badge/GitHub_Pages-black?color=000000&logo=github" /></a>
</p>

<b>Colir — fast & secure <ins>messaging platform</ins> </b>with<b> end-to-end</b> encryption. <br>

<b>BackEnd</b> can be found <a href="https://github.com/MrQuackDuck/ColirBackend/">here</a>.

## 🌈 The idea
The main goal of **Colir** is to provide an ability to **communicate securely**. <br>

To implement that, **end-to-end encryption** was chosen. Before using the application, **users should discuss a secret key** that will be **used to encrypt & decrypt** the data.<br>
> [!NOTE]
> The **encryption keys** for rooms are stored **on the client only**. They're **not being sent to the server**.

This **API's role** is **to transfer** and **store** the encrypted data.

## 🌠 Features
Besides that, **Colir** **has** a couple of **features**, which can interest you in:
- **Rooms** are places where the encrypted communication happens. When a user **creates** a room, he/she chooses an **encryption key** (which will be stored at the client) and receives a **room GUID**. **They can share that GUID** with someone else so they **can join** that room. **Anyone** who has **the GUID** of a certain room **can join** it, but it will be **impossible to decrypt** the data **if** the **wrong encryption** key was provided.
- **Expiry date** can be provided for **rooms**. **When** the **expiry date comes**, all **data won't be accessible** and **will be deleted** forever.
- There's only **one voice channel** per room.
- **Passwordless authentication**. There are **three ways to authenticate**: **anonymous** (gives you a one-time JWT), **GitHub** account, and **Google** account.
- Each user has a unique **"Colir ID"**, which is a **6 symbol-length hexadecimal number** to identify a user.
> [!CAUTION]
> If you authenticate as **anonymous**, you **won't be able to login** into that account again.<br>
> **Therefore**, use **3rd party providers** such as **GitHub** and **Google** to be able to login as much as you want.

## 👀 Screenshots
### 🖥 Desktop (~w1910px):
<img width=400 src="https://github.com/user-attachments/assets/903932c4-4c5f-42de-a1d2-65ddbcc90742" />
<img width=400 src="https://github.com/user-attachments/assets/9e098453-ab8d-42e0-b15b-b5565f50e823" />
<img width=400 src="https://github.com/user-attachments/assets/9b90a147-9931-4e1b-a986-07c9a95462db" />
<img width=400 src="https://github.com/user-attachments/assets/98a5ee9b-eaac-43a6-9ed0-1cd3b6f4bccc" />
<img width=400 src="https://github.com/user-attachments/assets/0ac26b1e-dfa9-4fff-80f9-ee97ac4be797" />
<img width=400 src="https://github.com/user-attachments/assets/a0584dcb-a518-47d3-8816-78cb495b4226" />

### 📱 Mobile (~w440px):

<img width=200 src="https://github.com/user-attachments/assets/ce9ef5fc-389d-4189-98a7-01c1438fa0ab" />
<img width=200 src="https://github.com/user-attachments/assets/351345f6-47c4-4ef8-9e64-108870d66d73" />
<img width=200 src="https://github.com/user-attachments/assets/e85cfd3e-7af3-4379-9d72-73abea544584" />

## 🚀 Development server
1. Install [node.js](https://nodejs.org/en)
2. Install [pnpm](https://pnpm.io/installation)<br>
   **>** `npm install -g pnpm`
4. Clone the repo<br>
   **>** `git clone https://github.com/MrQuackDuck/ColirWebClient.git`
5. Jump into the folder<br>
   **>** `cd .\ColirWebClient\`
6. Install all packages<br>
   **>** `pnpm i`
7. Run the server<br>
   **>** `pnpm run dev`

<img src="https://github.com/user-attachments/assets/f9ec28fc-9592-4669-9ca8-49a7bd0a9cb4" />
