# File Manifest for GitHub Upload

## Essential Files to Upload

### Root Configuration Files
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Locked dependency versions
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `components.json` - shadcn/ui component configuration
- `drizzle.config.ts` - Database ORM configuration
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules
- `README.md` - Project documentation
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `replit.md` - Project overview and preferences

### Client-Side Code
```
client/
├── index.html
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   │   ├── Footer.tsx
│   │   ├── GamePreview.tsx
│   │   ├── Header.tsx
│   │   ├── RegistrationForm.tsx
│   │   ├── ScratchCard.tsx
│   │   ├── VideoSection.tsx
│   │   └── ui/ (entire folder - 45+ components)
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── queryClient.ts
│   │   └── utils.ts
│   └── pages/
│       ├── Admin.tsx
│       ├── Game.tsx
│       ├── Home.tsx
│       ├── Login.tsx
│       └── not-found.tsx
```

### Server-Side Code
```
server/
├── index.ts
├── db.ts
├── routes.ts
├── storage.ts
├── types.ts
├── vite.ts
└── emailTemplates.ts
```

### Shared Code
```
shared/
└── schema.ts
```

### Asset Files
```
attached_assets/
├── FirstCardPrizes_1751835723207.png
├── GamePage_1751834863545.png
├── GamePage_1751837865404.png
├── SecondCardPrizes_1751835728841.png
├── gamepagecheck_1751834898652.png
├── heading_1751837138504.png
├── logo_1752555507955.png
├── prizes_1751801606346.png
├── Home-page-D4U-Pros-Scratch-&-Win-Game-Card-EMPTY_1751279689511.png
├── Home-page-D4U-Pros-Scratch-&-Win-Game-Card-EMPTY_1751568303427.png
├── Michael Patrick - PART 1 D4UP Scratch & Win (1)_1751280936821.mp4
├── Michael-Patrick With Prizes -D4U-Pros-Scratch-&-Win-Game-Card With Prizes_1751568303429.png
├── Way Come_1751571056861.otf
├── afterplaygame_1751570000685.png
├── backgroundwheelcard_1751572508793.png
├── footer_1751279092056.png
├── gamepreview_1751569958202.png
├── header+video_1751279069002.png
├── logo_1751279296203.png
└── update_preview_1751570392036.png
```

## Upload Instructions

### Method 1: Drag & Drop (Recommended)
1. Go to https://github.com/malik-13503/D4YouPromotion
2. Click "uploading an existing file"
3. Drag and drop all files/folders maintaining structure
4. Commit with message: "Initial commit: D4U Pros Platform"

### Method 2: Git Commands
```bash
git clone https://github.com/malik-13503/D4YouPromotion.git
cd D4YouPromotion
# Copy all files here
git add .
git commit -m "Initial commit: D4U Pros Platform"
git push origin main
```

### Method 3: GitHub Desktop
1. Clone repository in GitHub Desktop
2. Copy all files to local repository folder
3. Review changes and commit
4. Push to origin

## File Counts
- **Total TypeScript/JavaScript files**: 73
- **Configuration files**: 13
- **Asset files**: 19
- **Documentation files**: 4
- **UI Components**: 45+

## Important Notes
- Maintain exact folder structure
- Include all asset files in `attached_assets/`
- Don't upload `node_modules/` or `.git/`
- Include `.env.example` but not `.env`
- All files use UTF-8 encoding

## Verification Checklist
- [ ] All source files uploaded
- [ ] Configuration files included
- [ ] Asset files in correct locations
- [ ] Documentation files added
- [ ] .gitignore properly configured
- [ ] .env.example included
- [ ] No sensitive data uploaded

## Post-Upload Steps
1. Set up environment variables on deployment platform
2. Run `npm install` to install dependencies
3. Run `npm run db:push` to set up database
4. Test the application functionality
5. Configure custom domain if needed