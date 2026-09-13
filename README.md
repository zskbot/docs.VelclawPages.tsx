# Velclaw Docs

Trang tài liệu Velclaw dựng theo phong cách Mintlify: HTML + TSX + Tailwind + JSON.

## Cấu trúc dự án

```
velclaw-docs/
├── index.html                 ← file HTML gốc, điểm vào của trình duyệt
├── content/
│   ├── nav.json                ← cấu hình sidebar (thêm/xoá trang tại đây)
│   └── quickstart.json         ← toàn bộ nội dung trang Quickstart
├── src/
│   ├── main.tsx                 ← khởi tạo React vào index.html
│   ├── App.tsx                  ← nơi gắn thêm router/trang khác sau này
│   ├── index.css                ← Tailwind + animation dùng chung
│   ├── lib/
│   │   ├── types.ts             ← kiểu dữ liệu cho các file JSON
│   │   └── icons.tsx            ← ánh xạ tên icon (string trong JSON) → component
│   ├── components/
│   │   ├── Header.tsx           ← thanh trên cùng: search, toggle sáng/tối
│   │   ├── Sidebar.tsx           ← menu trái, đọc từ nav.json
│   │   ├── Toc.tsx               ← mục lục phải, tự bôi đậm khi cuộn
│   │   ├── CodeBlock.tsx         ← khối lệnh có nút Sao chép
│   │   ├── SearchModal.tsx       ← modal tìm kiếm (⌘K)
│   │   └── VelclawMark.tsx       ← logo
│   └── pages/
│       └── Quickstart.tsx        ← trang Quickstart, đọc content/quickstart.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── tsconfig.json
```

## Chạy thử

```bash
npm install
npm run dev
```

Mở `http://localhost:5173`.

## Build ra file tĩnh (HTML/CSS/JS thật)

```bash
npm run build
```

Kết quả nằm trong thư mục `dist/` — đây là `index.html` + CSS + JS đã build sẵn,
có thể deploy lên bất kỳ static host nào (Vercel, Netlify, GitHub Pages...).

## Thêm một trang tài liệu mới (ví dụ: Workspace)

1. Tạo `content/workspace.json` theo cùng cấu trúc với `quickstart.json`.
2. Tạo `src/pages/Workspace.tsx`, copy cấu trúc từ `Quickstart.tsx`, đổi
   `quickstart.json` thành `workspace.json`.
3. Thêm route trong `App.tsx` (khuyến khích dùng `react-router-dom` khi có
   nhiều hơn 1-2 trang).
4. Cập nhật `content/nav.json` nếu cần đổi thứ tự hoặc nhãn hiển thị.

Không cần sửa `Sidebar.tsx`, `Header.tsx`, `Toc.tsx` hay `CodeBlock.tsx` —
các component này đọc dữ liệu từ JSON nên dùng lại được cho mọi trang.
