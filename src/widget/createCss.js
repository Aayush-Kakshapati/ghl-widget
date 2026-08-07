export function createCss(settings) {
  return `
.announcement-banner{
    background:${settings.colors.background};
    color:${settings.colors.text};
    padding:20px;
    border-radius:8px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:20px;
}

.banner-button{
    background:${settings.colors.button};
    color:white;
    padding:10px 18px;
    border-radius:6px;
    text-decoration:none;
}
`;
}