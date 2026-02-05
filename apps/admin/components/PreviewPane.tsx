'use client';

import { useState } from 'react';
import { LuMonitor, LuTablet, LuSmartphone, LuSun, LuMoon, LuX } from 'react-icons/lu';
import type { Issue, Section } from '@azalea/shared/types';
import { SectionRenderer } from '@azalea/sections';

interface PreviewPaneProps {
  issue: Issue;
  sections: Section[];
  onClose?: () => void;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';
type PreviewTheme = 'dark' | 'light';

// CSS variables matching web app globals.css - Dark theme (default)
const darkThemeVars = {
  '--background': '#1a1a1a',
  '--foreground': '#ffffff',
  '--primary': '#016f53',
  '--primary-foreground': '#ffffff',
  '--secondary': '#ff8c42',
  '--secondary-foreground': '#1a1a1a',
  '--accent': '#cc0000',
  '--accent-foreground': '#ffffff',
  '--muted': '#666666',
  '--muted-foreground': '#cccccc',
  '--card': '#242424',
  '--card-foreground': '#ffffff',
  '--border': '#333333',
  '--background-color': '#1a1a1a',
  '--text-color': '#ffffff',
  '--header-bg': '#242424',
  '--header-text-color': '#ffffff',
  '--border-color': '#333333',
  '--link-color': '#ffffff',
  '--link-hover-color': '#ff8c42',
  '--primary-color': '#016f53',
  '--card-bg': '#f7f3e8',
  '--card-bg-alt': '#FFE6D6',
  '--card-bg-green': '#e6f0ed',
  '--card-bg-interns': 'rgb(221, 254, 233)',
  '--card-text': '#333333',
  '--card-heading': '#016f53',
  '--accent-green': '#016f53',
  '--accent-green-hover': '#014d3a',
  '--accent-orange': '#ff8c42',
  '--radius': '12px',
  '--shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
} as React.CSSProperties;

// CSS variables matching web app globals.css - Light theme
const lightThemeVars = {
  '--background': '#f5f5f5',
  '--foreground': '#1a1a1a',
  '--primary': '#016f53',
  '--primary-foreground': '#ffffff',
  '--secondary': '#ff8c42',
  '--secondary-foreground': '#1a1a1a',
  '--accent': '#cc0000',
  '--accent-foreground': '#ffffff',
  '--muted': '#999999',
  '--muted-foreground': '#666666',
  '--card': '#ffffff',
  '--card-foreground': '#1a1a1a',
  '--border': '#e0e0e0',
  '--background-color': '#f5f5f5',
  '--text-color': '#1a1a1a',
  '--header-bg': '#ffffff',
  '--header-text-color': '#016f53',
  '--border-color': '#e0e0e0',
  '--link-color': '#016f53',
  '--link-hover-color': '#ff8c42',
  '--primary-color': '#016f53',
  '--card-bg': '#f7f3e8',
  '--card-bg-alt': '#FFE6D6',
  '--card-bg-green': '#e6f0ed',
  '--card-bg-interns': 'rgb(221, 254, 233)',
  '--card-text': '#333333',
  '--card-heading': '#016f53',
  '--accent-green': '#016f53',
  '--accent-green-hover': '#014d3a',
  '--accent-orange': '#ff8c42',
  '--radius': '12px',
  '--shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
} as React.CSSProperties;

export function PreviewPane({ issue, sections, onClose }: PreviewPaneProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>('dark');

  const viewportStyles = {
    desktop: 'w-full',
    tablet: 'max-w-[768px] mx-auto',
    mobile: 'max-w-[375px] mx-auto',
  };

  const visibleSections = sections.filter((s) => s.visible);
  const themeVars = previewTheme === 'dark' ? darkThemeVars : lightThemeVars;

  const formatEditionDate = () => {
    if (!issue) return '';
    const date = issue.bannerDate
      ? new Date(issue.bannerDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : '';
    return `Edition ${issue.edition || 1} | ${date}`;
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#111' }}>
      {/* Toolbar */}
      <div
        className="border-b p-3 flex items-center justify-between flex-shrink-0"
        style={{ backgroundColor: '#1e1e1e', borderColor: '#333' }}
      >
        {/* Viewport Toggles */}
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: '#2a2a2a' }}>
          <button
            onClick={() => setViewport('desktop')}
            className="p-2 rounded transition-colors"
            style={{
              backgroundColor: viewport === 'desktop' ? '#016f53' : 'transparent',
              color: viewport === 'desktop' ? '#ffffff' : '#999',
            }}
            title="Desktop view"
          >
            <LuMonitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className="p-2 rounded transition-colors"
            style={{
              backgroundColor: viewport === 'tablet' ? '#016f53' : 'transparent',
              color: viewport === 'tablet' ? '#ffffff' : '#999',
            }}
            title="Tablet view"
          >
            <LuTablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className="p-2 rounded transition-colors"
            style={{
              backgroundColor: viewport === 'mobile' ? '#016f53' : 'transparent',
              color: viewport === 'mobile' ? '#ffffff' : '#999',
            }}
            title="Mobile view"
          >
            <LuSmartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Toggle & Close */}
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: '#999' }}>
            {previewTheme === 'dark' ? 'Dark' : 'Light'}
          </span>
          <button
            onClick={() => setPreviewTheme(previewTheme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full transition-colors"
            style={{ backgroundColor: '#016f53', color: '#fff' }}
            title={`Switch to ${previewTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {previewTheme === 'dark' ? (
              <LuSun className="w-4 h-4" />
            ) : (
              <LuMoon className="w-4 h-4" />
            )}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded transition-colors"
              style={{ color: '#999' }}
              title="Close preview"
            >
              <LuX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-y-auto">
        <div className={`preview-viewport-container ${viewportStyles[viewport]} transition-all duration-300`}>
          {/* Website Preview - exact replica of web app structure */}
          <div className="website-preview" style={themeVars}>
            <div className="wp-page-background">
              {/* Header - matches web app HomePageClient.tsx */}
              <header className="wp-site-header">
                <div className="wp-header-content">
                  <div className="wp-header-left">
                    <div className="wp-header-logo">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 3024 1964"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g>
                          <path
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="15"
                            d="M 1391.476685 1267.928467 C 1396.583984 1271.886719 1402.967773 1274.057251 1409.479858 1274.057251 L 1762.270264 1274.057251 C 1774.527832 1274.057251 1785.380737 1266.651611 1789.849854 1255.160156 C 1794.31897 1243.668579 1791.254395 1230.899902 1782.061157 1222.600586 C 1739.926025 1184.678833 1704.046387 1139.608398 1674.937866 1088.657715 L 1852.673218 755.405884 C 1856.886719 747.489502 1853.950073 737.657715 1846.033691 733.444336 L 1768.657104 692.202393 C 1760.740723 687.98877 1750.908936 690.925537 1746.695557 698.841919 L 1615.947754 943.356689 C 1602.157959 888.835693 1596.667236 833.675659 1599.731689 778.769653 C 1600.242432 770.725586 1597.305664 762.681152 1591.687622 756.808105 C 1586.197144 750.934692 1578.281006 747.61499 1570.236816 747.61499 L 1199.697388 747.61499 C 1184.120361 747.61499 1171.223755 759.872559 1170.202271 775.449463 C 1164.711914 867.512329 1182.459961 962.247375 1221.53064 1049.333618 C 1260.601318 1136.542358 1319.338257 1212.130981 1391.478394 1267.927734 Z M 1765.203125 720.928467 L 1823.809937 752.210693 L 1625.514526 1124.024902 L 1566.907593 1092.742676 Z M 1606.622314 1144.453369 L 1560.65625 1173.565308 L 1560.273193 1119.682373 Z M 1197.144531 776.978394 C 1197.272217 775.573975 1198.421387 774.424805 1199.698242 774.424805 L 1570.360229 774.424805 C 1571.254028 774.424805 1571.892334 774.807861 1572.275513 775.190918 C 1572.658569 775.573975 1573.041626 776.212402 1573.041626 777.106201 C 1571.126343 811.452881 1572.403198 846.565918 1576.87207 881.426636 C 1581.085571 913.730225 1588.108276 946.034058 1597.684692 977.697876 L 1537.03479 1091.464844 C 1534.481201 1096.189087 1533.204346 1101.552002 1533.204346 1107.041748 L 1533.970459 1192.714355 C 1533.970459 1198.587891 1537.290161 1204.078003 1542.397095 1206.887451 C 1544.82312 1208.164307 1547.504517 1208.93042 1550.185791 1208.93042 C 1553.250122 1208.93042 1556.187012 1208.036499 1558.868286 1206.376709 L 1631.903198 1160.155762 C 1636.627441 1157.218994 1640.585693 1153.005371 1643.266846 1148.025513 L 1659.99353 1116.743408 C 1672.251099 1136.661987 1685.530273 1155.942383 1699.958252 1174.072998 C 1719.493652 1198.843262 1741.071899 1221.95459 1764.183228 1242.638794 C 1764.566284 1242.894165 1765.587769 1243.915527 1764.949341 1245.575562 C 1764.310913 1247.235474 1762.906372 1247.235352 1762.523315 1247.235352 L 1409.479614 1247.235352 C 1408.968872 1247.235352 1408.330444 1247.107666 1407.947388 1246.724609 C 1269.158569 1139.217285 1186.419678 954.838257 1197.140991 776.980347 Z"
                          />
                          <path
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="15"
                            d="M 1388.918945 1144.069336 C 1390.834229 1144.580078 1392.74939 1144.963135 1394.536987 1145.218506 C 1397.218384 1161.43457 1404.496704 1176.117432 1415.604614 1187.098633 C 1427.989624 1199.356201 1444.972168 1207.017334 1463.486084 1208.549561 C 1465.784424 1208.804932 1468.082642 1208.804932 1470.380981 1208.804932 C 1486.469482 1208.804932 1501.791504 1204.080566 1514.304077 1195.270752 L 1498.727051 1173.309204 C 1479.829956 1186.71582 1450.973145 1184.290527 1434.502197 1167.946533 C 1428.245728 1161.690186 1424.032471 1153.645996 1421.861206 1145.091064 C 1430.41626 1143.558838 1438.332275 1140.494385 1445.482544 1136.152832 C 1456.973633 1129.130127 1464.635376 1119.809326 1467.571533 1109.083984 C 1469.486816 1102.31665 1469.10376 1094.783325 1466.677734 1088.143799 C 1463.868652 1080.610352 1458.505981 1074.609741 1451.610718 1071.417114 C 1443.18396 1067.45874 1433.479248 1067.969482 1424.286011 1072.566162 C 1417.518799 1076.013672 1411.261841 1081.504395 1406.666138 1088.271484 C 1400.664917 1096.953857 1396.578857 1106.912842 1394.663452 1117.510742 C 1382.405884 1114.446289 1370.914673 1107.168579 1363.636108 1096.570557 C 1349.080688 1075.247314 1351.37854 1043.199341 1368.74353 1022.003479 C 1385.470215 1001.574097 1415.730957 991.104492 1443.821289 995.956055 C 1449.694824 996.977539 1455.823975 998.509705 1462.335205 1000.169617 C 1483.531128 1005.532288 1507.663086 1011.660767 1529.113892 998.254333 C 1535.881104 994.040771 1541.244019 988.422852 1545.457397 981.400146 C 1549.160156 975.015991 1551.586182 967.866089 1552.607666 960.076782 C 1554.650635 945.138062 1551.330811 929.432739 1543.54187 917.047729 C 1531.029297 897.001465 1508.939453 882.44519 1477.78479 873.762695 C 1463.356689 869.804565 1448.417114 867.250854 1433.223389 866.357056 C 1418.284668 865.463379 1403.090088 865.973999 1388.151367 868.016968 C 1373.212646 870.059814 1358.401367 873.507324 1344.228271 878.486572 C 1329.800171 883.466309 1316.010376 889.85022 1303.242065 897.51123 L 1317.03186 920.621704 C 1362.359741 893.552856 1419.81604 885.764404 1470.758667 899.809082 C 1495.146362 906.576294 1512.00061 917.174072 1520.810547 931.347168 C 1529.237305 944.881165 1528.599243 967.225952 1515.064819 975.525208 C 1503.317993 982.803101 1486.591309 978.5896 1468.971313 974.248352 C 1462.204224 972.588501 1455.309082 970.800842 1448.414551 969.651794 C 1410.492676 963.267578 1371.037964 977.18512 1348.057373 1005.275635 C 1336.182983 1019.703674 1328.904419 1038.217529 1327.500488 1057.498047 C 1326.095947 1077.289063 1331.075684 1096.697021 1341.417847 1112.019043 C 1346.908325 1120.06311 1353.93042 1126.957764 1362.35791 1132.575928 C 1370.529663 1137.810791 1379.467896 1141.769043 1388.916016 1144.066895 Z M 1428.883667 1103.848877 C 1432.45874 1098.741455 1437.310425 1095.80481 1439.609131 1095.80481 C 1439.86438 1095.80481 1440.119751 1095.80481 1440.375122 1095.932495 C 1441.269043 1096.31543 1442.545776 1099.252197 1441.779663 1102.061279 C 1440.758301 1105.891846 1437.05542 1109.849854 1431.692505 1113.297363 C 1428.755737 1115.084961 1425.691406 1116.361816 1422.499268 1117.383301 C 1423.776123 1112.531372 1425.946777 1107.935059 1428.883423 1103.849243 Z"
                          />
                        </g>
                      </svg>
                    </div>
                    <span className="wp-header-title">Azalea Report</span>
                  </div>
                  <nav className="wp-desktop-nav">
                    <span>Previous Issues</span>
                  </nav>
                </div>
              </header>

              {/* Header spacer for fixed header */}
              <div className="wp-header-spacer">
                <div className="wp-newsletter-container">
                  {/* Banner Section - matches web app banner structure */}
                  <div className="wp-banner-section">
                    <div className="wp-banner-content">
                      <div className="wp-banner-image-container">
                        {(issue as any).bannerImageUrl ? (
                          <img
                            src={(issue as any).bannerImageUrl}
                            alt={issue.title || 'Newsletter banner'}
                            className="wp-banner-image"
                          />
                        ) : (
                          <div
                            className="wp-banner-image"
                            style={{
                              backgroundColor: 'var(--card)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span style={{ color: 'var(--muted-foreground)' }}>Banner Image</span>
                          </div>
                        )}
                      </div>
                      <div className="wp-banner-overlay"></div>
                      <div className="wp-banner-text">
                        <h1 className="wp-banner-title">
                          {issue.bannerTitle || 'AZALEA REPORT'}
                        </h1>
                        <p className="wp-banner-subtitle">
                          SGMC Health Internal Medicine Residency Newsletter
                        </p>
                        <p className="wp-banner-date">
                          {formatEditionDate()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <main className="wp-main-content">
                    {visibleSections.length > 0 ? (
                      <div>
                        {visibleSections.map((section) => (
                          <SectionRenderer
                            key={section._id}
                            section={section}
                          />
                        ))}
                      </div>
                    ) : (
                      <div
                        className="section-card"
                        style={{
                          backgroundColor: 'var(--card-bg)',
                          borderRadius: '8px',
                          padding: '3rem',
                          textAlign: 'center',
                        }}
                      >
                        <p style={{ color: 'var(--card-text)', fontFamily: "'Georgia', serif", fontSize: '1.3rem' }}>
                          No visible sections
                        </p>
                        <p style={{ color: 'var(--muted)', fontFamily: "'Georgia', serif", fontSize: '1rem', marginTop: '0.5rem' }}>
                          Add sections to see preview
                        </p>
                      </div>
                    )}
                  </main>

                  {/* Footer - matches web app */}
                  <footer className="wp-site-footer">
                    <p>
                      &copy; {new Date().getFullYear()} SGMC Internal Medicine Residency Program
                    </p>
                    <p style={{ marginTop: '0.25rem', opacity: 0.7 }}>
                      Azalea Report Newsletter
                    </p>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded styles - matches web app globals.css exactly */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap');

        /* ===== BASE TYPOGRAPHY (scoped to preview) ===== */
        .website-preview {
          font-family: 'Georgia', serif;
          font-size: 1.3rem;
          line-height: 1.7;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .website-preview h1,
        .website-preview h2,
        .website-preview h3,
        .website-preview h4,
        .website-preview h5,
        .website-preview h6 {
          font-family: 'Georgia', serif;
          font-weight: 600;
        }

        .website-preview a {
          color: var(--foreground);
          transition: color 0.2s ease;
        }

        .website-preview a:hover {
          color: var(--muted-foreground);
        }

        /* ===== PAGE LAYOUT ===== */
        .wp-page-background {
          background-color: var(--background-color);
          color: var(--text-color);
          min-height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .wp-newsletter-container {
          font-family: 'Georgia', serif;
          font-size: 1.3rem;
          line-height: 1.7;
          margin: 0 auto;
          max-width: 1120px;
          padding: 0 40px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .wp-main-content {
          padding: 3rem 0;
          flex: 1;
        }

        /* ===== HEADER (sticky in preview, matches web fixed header) ===== */
        .wp-site-header {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background-color: var(--header-bg);
          z-index: 100;
          border-bottom: 1px solid var(--border-color);
        }

        .wp-header-content {
          max-width: 1200px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
        }

        .wp-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--header-text-color);
        }

        .wp-header-logo {
          transform: scale(6.0);
          display: flex;
          align-items: center;
          color: var(--header-text-color);
        }

        .wp-header-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.3rem;
          font-weight: bold;
          color: var(--header-text-color);
        }

        .wp-desktop-nav {
          display: flex;
          gap: 30px;
        }

        .wp-desktop-nav span {
          color: var(--header-text-color);
          text-decoration: none;
          font-family: 'Montserrat', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .wp-header-spacer {
          padding-top: 0; /* Not needed with sticky positioning */
        }

        /* ===== BANNER ===== */
        .wp-banner-section {
          width: 100%;
          position: relative;
          overflow: hidden;
          margin-top: 20px;
          border-radius: 12px;
        }

        .wp-banner-content {
          position: relative;
          width: 100%;
          display: flex;
        }

        .wp-banner-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 2/1;
          display: block;
          line-height: 0;
          overflow: hidden;
        }

        .wp-banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .wp-banner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.85),
            rgba(0, 0, 0, 0.3) 60%,
            rgba(0, 0, 0, 0.1) 100%
          );
        }

        .wp-banner-text {
          position: absolute;
          bottom: 32px;
          left: 32px;
          transform: none;
          padding: 0;
          width: 90%;
          max-width: 800px;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .wp-banner-title {
          color: white;
          font-family: 'Georgia', serif;
          font-size: 3rem;
          font-weight: bold;
          line-height: 1.2;
          margin: 0;
        }

        .wp-banner-subtitle {
          font-family: 'Georgia', serif;
          font-size: 1.6rem;
          font-weight: normal;
          margin: 0;
          color: white;
          line-height: 1.4;
        }

        .wp-banner-date {
          display: flex;
          flex-direction: column;
          font-family: 'Montserrat', sans-serif;
          font-size: 1.4rem;
          color: white;
        }

        /* ===== FOOTER ===== */
        .wp-site-footer {
          font-size: 1rem;
          padding: 2rem 0 0.5rem;
          text-align: center;
          color: var(--foreground);
        }

        /* ===== SECTION CARD ===== */
        .website-preview .section-card {
          background-color: var(--card-bg);
          color: #333333 !important;
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .website-preview .section-card *:not(.toggle-button) {
          color: #333333;
        }

        .website-preview .section-card-alt {
          background-color: var(--card-bg-alt);
        }

        .website-preview .section-card-green {
          background-color: var(--card-bg-green);
        }

        .website-preview .section-card-interns {
          background-color: var(--card-bg-interns);
        }

        .website-preview .section-card h2,
        .website-preview .section-card h3,
        .website-preview .section-card h4 {
          color: #016f53 !important;
          font-family: 'Montserrat', sans-serif;
          margin-bottom: 1rem;
        }

        .website-preview .section-card h2 {
          font-size: 1.5rem;
          line-height: 1.4;
          font-weight: bold;
          margin: 0 0 1rem 0;
        }

        .website-preview .section-card h3 {
          font-size: 1.5rem;
          line-height: 1.3;
        }

        .website-preview .section-card p {
          color: #333333 !important;
          font-size: 1.3rem;
          line-height: 1.6;
        }

        .website-preview .section-card strong {
          color: #016f53 !important;
        }

        .website-preview .section-card a {
          color: #016f53 !important;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .website-preview .section-card a:hover {
          color: #014d3a !important;
        }

        /* ===== SECTION TITLE ===== */
        .website-preview .section-title {
          font-family: 'Montserrat', sans-serif;
          line-height: 1.4;
          margin: 1rem auto;
        }

        /* ===== SECTION WITH BACKGROUND ===== */
        .website-preview .section-with-bg,
        .website-preview .section-with-bg *,
        .website-preview .section-with-bg p,
        .website-preview .section-with-bg div,
        .website-preview .section-with-bg span,
        .website-preview .section-with-bg li,
        .website-preview .section-with-bg .basic-text,
        .website-preview .section-with-bg .basic-text *,
        .website-preview .section-with-bg .spotlight-text,
        .website-preview .section-with-bg .spotlight-text *,
        .website-preview .section-with-bg .spotlightText,
        .website-preview .section-with-bg .spotlightText *,
        .website-preview .section-with-bg .chief-text,
        .website-preview .section-with-bg .chief-text *,
        .website-preview .section-with-bg .intern-text,
        .website-preview .section-with-bg .intern-text *,
        .website-preview .section-with-bg .featureBullets,
        .website-preview .section-with-bg .featureBullets *,
        .website-preview .section-with-bg .basic-author,
        .website-preview .section-with-bg .basic-description {
          color: #333333 !important;
        }

        .website-preview .section-with-bg .basic-title,
        .website-preview .section-with-bg .section-title,
        .website-preview .section-with-bg .spotlight-name,
        .website-preview .section-with-bg .spotlightName,
        .website-preview .section-with-bg .chief-name,
        .website-preview .section-with-bg .intern-name,
        .website-preview .section-with-bg .featureSubtitle,
        .website-preview .section-with-bg .sectionTitle,
        .website-preview .section-with-bg .spotlight-label,
        .website-preview .section-with-bg h2,
        .website-preview .section-with-bg h3,
        .website-preview .section-with-bg h4,
        .website-preview .section-with-bg strong {
          color: #016f53 !important;
        }

        .website-preview .section-with-bg .featureCaption,
        .website-preview .section-with-bg .basic-cover-image-caption {
          color: #666666 !important;
        }

        .website-preview .section-with-bg a {
          color: #016f53 !important;
        }

        .website-preview .section-with-bg a:hover {
          color: #014d3a !important;
        }

        /* ===== SECTION TRANSPARENT ===== */
        .website-preview .section-transparent {
          background-color: transparent !important;
        }

        .website-preview .section-transparent,
        .website-preview .section-transparent p,
        .website-preview .section-transparent div,
        .website-preview .section-transparent span,
        .website-preview .section-transparent li,
        .website-preview .section-transparent .basic-text,
        .website-preview .section-transparent .basic-text *,
        .website-preview .section-transparent .spotlight-text,
        .website-preview .section-transparent .spotlight-text *,
        .website-preview .section-transparent .spotlightText,
        .website-preview .section-transparent .spotlightText *,
        .website-preview .section-transparent .chief-text,
        .website-preview .section-transparent .chief-text *,
        .website-preview .section-transparent .intern-text,
        .website-preview .section-transparent .intern-text *,
        .website-preview .section-transparent .featureBullets,
        .website-preview .section-transparent .featureBullets li,
        .website-preview .section-transparent .basic-author,
        .website-preview .section-transparent .basic-description,
        .website-preview .section-transparent .spotlight-detail {
          color: var(--foreground) !important;
        }

        .website-preview .section-transparent .basic-title,
        .website-preview .section-transparent .section-title,
        .website-preview .section-transparent .spotlight-name,
        .website-preview .section-transparent .spotlightName,
        .website-preview .section-transparent .chief-name,
        .website-preview .section-transparent .intern-name,
        .website-preview .section-transparent .featureSubtitle,
        .website-preview .section-transparent .sectionTitle,
        .website-preview .section-transparent .spotlight-label,
        .website-preview .section-transparent h2,
        .website-preview .section-transparent h3,
        .website-preview .section-transparent h4,
        .website-preview .section-transparent strong {
          color: var(--primary) !important;
        }

        .website-preview .section-transparent .featureCaption,
        .website-preview .section-transparent .basic-cover-image-caption {
          color: var(--muted-foreground) !important;
        }

        .website-preview .section-transparent a {
          color: var(--primary) !important;
        }

        .website-preview .section-transparent a:hover {
          color: var(--accent-green-hover) !important;
        }

        /* ===== SPOTLIGHT SECTION ===== */
        .website-preview .spotlight-container {
          background-color: #f7f3e8;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .website-preview .spotlight-container,
        .website-preview .spotlight-container * {
          color: #333333 !important;
        }

        .website-preview .spotlight-container .toggle-button {
          color: #ffffff !important;
          background-color: #016f53 !important;
        }

        .website-preview .spotlight-container .spotlight-name,
        .website-preview .spotlight-container .section-title,
        .website-preview .spotlight-container .spotlight-label,
        .website-preview .spotlight-container h2,
        .website-preview .spotlight-container h3,
        .website-preview .spotlight-container strong {
          color: #016f53 !important;
        }

        .website-preview .spotlight-image {
          border-radius: 4px;
          height: auto;
          margin-bottom: 1rem;
          object-fit: cover;
          width: 100%;
        }

        .website-preview .spotlight-name {
          color: #016f53 !important;
          font-family: 'Montserrat', sans-serif;
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .website-preview .spotlight-text,
        .website-preview .spotlight-text *,
        .website-preview .spotlight-text p,
        .website-preview .spotlight-text div,
        .website-preview .spotlight-text span,
        .website-preview .spotlight-container p,
        .website-preview .spotlight-container div,
        .website-preview .spotlight-container span {
          color: #333333 !important;
          font-size: 1.3rem;
          line-height: 1.6;
        }

        .website-preview .spotlight-container strong {
          color: #016f53 !important;
        }

        /* ===== CHIEFS SECTION ===== */
        .website-preview .chiefs-section {
          background-color: #e6f0ed;
          border-radius: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: space-between;
          padding: 2rem;
        }

        .website-preview .chiefs-section,
        .website-preview .chiefs-section * {
          color: #333333 !important;
        }

        .website-preview .chiefs-section .toggle-button {
          color: #ffffff !important;
          background-color: #016f53 !important;
        }

        .website-preview .chiefs-section .chief-name,
        .website-preview .chiefs-section .section-title,
        .website-preview .chiefs-section h2,
        .website-preview .chiefs-section h3,
        .website-preview .chiefs-section strong {
          color: #016f53 !important;
        }

        .website-preview .chief-column {
          background-color: transparent;
          box-sizing: border-box;
          flex-basis: calc(50% - 1rem);
          padding: 1.5rem;
        }

        .website-preview .chief-image {
          border-radius: 50%;
          height: 250px;
          margin-bottom: 1rem;
          object-fit: cover;
          width: 250px;
        }

        .website-preview .chief-name {
          color: #016f53 !important;
          font-family: 'Montserrat', sans-serif;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .website-preview .chief-text,
        .website-preview .chief-text *,
        .website-preview .chief-text p,
        .website-preview .chief-text div,
        .website-preview .chief-text span,
        .website-preview .chiefs-section p,
        .website-preview .chiefs-section div,
        .website-preview .chiefs-section span {
          color: #333333 !important;
          font-size: 1.3rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        /* ===== INTERNS SECTION ===== */
        .website-preview .interns-section {
          background-color: rgb(221, 254, 233);
          border-radius: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: space-between;
          padding: 2rem;
        }

        .website-preview .interns-section,
        .website-preview .interns-section * {
          color: #333333 !important;
        }

        .website-preview .interns-section .toggle-button {
          color: #ffffff !important;
          background-color: #016f53 !important;
        }

        .website-preview .interns-section .intern-name,
        .website-preview .interns-section .section-title,
        .website-preview .interns-section h2,
        .website-preview .interns-section h3,
        .website-preview .interns-section strong {
          color: #016f53 !important;
        }

        .website-preview .intern-column {
          background-color: transparent;
          box-sizing: border-box;
          flex-basis: calc(50% - 1rem);
          padding: 1.5rem;
          text-align: left;
        }

        .website-preview .intern-image {
          border-radius: 50%;
          height: 250px;
          margin: 0 0 1rem 0;
          object-fit: cover;
          width: 250px;
          display: block;
        }

        .website-preview .intern-name {
          color: #016f53 !important;
          font-family: 'Montserrat', sans-serif;
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          text-align: left;
        }

        .website-preview .intern-text,
        .website-preview .intern-text *,
        .website-preview .intern-text p,
        .website-preview .intern-text div,
        .website-preview .intern-text span,
        .website-preview .interns-section p,
        .website-preview .interns-section div,
        .website-preview .interns-section span {
          color: #333333 !important;
          font-size: 1.3rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          text-align: left;
        }

        /* ===== BASIC CONTENT SECTION ===== */
        .website-preview .basic-content {
          background-color: #FFE6D6;
          color: #333333 !important;
          border-radius: 15px;
          padding: 30px;
          overflow: visible;
        }

        .website-preview .basic-content,
        .website-preview .basic-content * {
          color: #333333 !important;
        }

        .website-preview .basic-content .toggle-button {
          color: #ffffff !important;
          background-color: #016f53 !important;
        }

        .website-preview .basic-content .basic-title,
        .website-preview .basic-content .section-title,
        .website-preview .basic-content h2,
        .website-preview .basic-content h3,
        .website-preview .basic-content strong {
          color: #016f53 !important;
        }

        .website-preview .basic-description {
          color: #333333 !important;
          font-size: 1.3rem;
          font-style: italic;
          line-height: 1.6;
          margin-top: 4rem;
        }

        .website-preview .basic-title {
          color: #016f53 !important;
          font-family: 'Montserrat', sans-serif;
          font-size: 1.5rem;
          line-height: 1.4;
          font-weight: bold;
          margin: 0;
        }

        .website-preview .basic-author {
          font-family: 'Montserrat', sans-serif;
          font-size: 1rem;
          font-style: italic;
          line-height: 1.4;
          margin: 0.2rem 0 1.3rem;
        }

        .website-preview .basic-image-wrapper {
          margin: 2rem 0 1rem;
          width: 100%;
        }

        .website-preview .basic-cover-image {
          border-radius: 8px;
          height: auto;
          width: 100%;
        }

        .website-preview .basic-cover-image-caption {
          display: block;
          font-size: 0.9rem;
          font-style: italic;
          text-align: left;
        }

        .website-preview .basic-text,
        .website-preview .basic-text * {
          font-size: 1.3rem;
          line-height: 1.6;
        }

        .website-preview .section-with-bg .basic-text,
        .website-preview .section-with-bg .basic-text * {
          color: #333333 !important;
        }

        .website-preview .basic-content .basic-text,
        .website-preview .basic-content .basic-text * {
          color: #333333 !important;
        }

        .website-preview .basic-content strong {
          color: #016f53 !important;
        }

        /* ===== TOGGLE BUTTON ===== */
        .website-preview .toggle-button,
        .website-preview button.toggle-button,
        .website-preview .section-with-bg .toggle-button,
        .website-preview .section-transparent .toggle-button,
        .website-preview .section-card .toggle-button,
        .website-preview * .toggle-button {
          background-color: #016f53 !important;
          border-radius: 4px;
          border: none;
          color: #ffffff !important;
          cursor: pointer;
          font-family: 'Georgia', serif;
          font-size: 1.3rem;
          margin-top: 10px;
          padding: 0.5rem 1rem;
          transition: background-color 0.01s ease;
        }

        .website-preview .toggle-button:hover,
        .website-preview button.toggle-button:hover {
          background-color: #014d3a !important;
          color: #ffffff !important;
        }

        /* ===== TWO-COLUMN SPOTLIGHT GRIDS ===== */
        .website-preview .spotlight-grid,
        .website-preview .chiefs-grid,
        .website-preview .interns-grid {
          display: grid;
          grid-template-columns: minmax(200px, 280px) 1fr;
          gap: 2rem;
          align-items: start;
        }

        .website-preview .spotlight-grid img,
        .website-preview .chiefs-grid img,
        .website-preview .interns-grid img {
          width: 100%;
          height: auto;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          border-radius: 12px;
        }

        /* ===== TWO COLUMN LAYOUT ===== */
        .website-preview .twoColumns {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          background-color: transparent;
          padding: 1.5rem 0;
          margin-bottom: 2rem;
        }

        .website-preview .column {
          flex-basis: calc(50% - 1rem);
          flex: 1;
          min-width: calc(50% - 1rem);
        }

        /* ===== SECTION TITLE (camelCase) ===== */
        .website-preview .sectionTitle {
          color: #016f53;
          font-family: 'Montserrat', sans-serif;
          font-size: 1.5rem;
          font-weight: bold;
          line-height: 1.4;
          margin: 0 0 1rem 0;
        }

        /* ===== SPOTLIGHT CONTAINER (camelCase) ===== */
        .website-preview .spotlightContainer {
          background-color: #f7f3e8;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .website-preview .spotlightContainer,
        .website-preview .spotlightContainer * {
          color: #333333 !important;
        }

        .website-preview .spotlightContainer .toggle-button {
          color: #ffffff !important;
          background-color: #016f53 !important;
        }

        .website-preview .spotlightContainer .spotlightName,
        .website-preview .spotlightContainer .sectionTitle,
        .website-preview .spotlightContainer .spotlight-label,
        .website-preview .spotlightContainer h2,
        .website-preview .spotlightContainer h3,
        .website-preview .spotlightContainer strong {
          color: #016f53 !important;
        }

        .website-preview .spotlightImage {
          border-radius: 4px;
          height: auto;
          margin-bottom: 1rem;
          object-fit: cover;
          width: 100%;
        }

        .website-preview .spotlightName {
          color: #016f53 !important;
          font-family: 'Montserrat', sans-serif;
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.75rem;
        }

        .website-preview .spotlightText,
        .website-preview .spotlightText *,
        .website-preview .spotlightText p,
        .website-preview .spotlightText div,
        .website-preview .spotlightText span,
        .website-preview .spotlightContainer p,
        .website-preview .spotlightContainer div,
        .website-preview .spotlightContainer span {
          color: #333333 !important;
          font-size: 1.3rem;
          line-height: 1.6;
        }

        .website-preview .spotlightContainer strong,
        .website-preview .spotlightContainer .spotlight-label {
          color: #016f53 !important;
        }

        .website-preview .spotlight-detail {
          margin-bottom: 0.75rem;
        }

        .website-preview .spotlight-label {
          color: #016f53 !important;
        }

        /* ===== FEATURE IMAGE STYLING ===== */
        .website-preview .featureImageContainer {
          margin-bottom: 1rem;
        }

        .website-preview .featureImage {
          width: 100%;
          height: auto;
          border-radius: 4px;
        }

        .website-preview .featureCaption,
        .website-preview .spotlightContainer .featureCaption,
        .website-preview .section-with-bg .featureCaption {
          font-size: 0.9rem !important;
          font-style: italic;
          margin-top: 0.5rem;
          text-align: left;
          color: #666666 !important;
        }

        .website-preview .section-transparent .featureCaption {
          font-size: 0.9rem !important;
          font-style: italic;
          margin-top: 0.5rem;
          text-align: left;
          color: var(--muted-foreground) !important;
        }

        .website-preview .featureSubtitle {
          color: #016f53 !important;
          font-family: 'Montserrat', sans-serif;
          font-size: 1.3rem;
          font-weight: bold;
          margin: 1rem 0 0.75rem 0;
        }

        .website-preview .featureBullets {
          color: #333333 !important;
          font-size: 1.3rem;
          line-height: 1.6;
          margin: 0;
          padding-left: 0;
          list-style-position: inside;
          list-style-type: disc;
        }

        .website-preview .featureBullets li {
          color: #333333 !important;
          font-size: 1.3rem;
          line-height: 1.6;
          margin-bottom: 0.5rem;
          padding-left: 0;
          text-indent: 0;
        }

        .website-preview .featureBullets li::marker {
          color: #016f53;
        }

        /* ===== TEXT IMAGE SECTION ===== */
        .website-preview .text-image-float {
          margin-bottom: 1rem;
          max-width: 45%;
        }

        .website-preview .text-image-float.float-left {
          float: left;
          margin-right: 1.5rem;
        }

        .website-preview .text-image-float.float-right {
          float: right;
          margin-left: 1.5rem;
        }

        .website-preview .text-image-float img {
          width: 100%;
          height: auto;
          border-radius: 8px;
          object-fit: cover;
          display: block;
        }

        .website-preview .text-image-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        /* ===== COMMUNITY SERVICE SECTION ===== */
        .website-preview .community-service-image {
          margin-bottom: 1rem;
          max-width: 45%;
        }

        .website-preview .community-service-image.float-left {
          float: left;
          margin-right: 1.5rem;
        }

        .website-preview .community-service-image.float-right {
          float: right;
          margin-left: 1.5rem;
        }

        .website-preview .community-service-image img {
          width: 100%;
          height: auto;
          border-radius: 8px;
          object-fit: cover;
          display: block;
        }

        /* ===== PODCAST SECTION ===== */
        .website-preview .podcast-episode {
          position: relative;
        }

        .website-preview .podcast-listen-button {
          display: block;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          border: 2px solid #016f53;
          background-color: var(--card);
          color: #016f53;
          font-family: 'Montserrat', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .website-preview .podcast-listen-button:hover {
          background-color: #016f53;
          color: #ffffff;
        }

        .website-preview .section-with-bg .podcast-listen-button {
          background-color: rgba(255, 255, 255, 0.8);
        }

        .website-preview .section-with-bg .podcast-listen-button:hover {
          background-color: #016f53;
          color: #ffffff;
        }

        /* ===== CUSTOM SECTION ===== */
        .website-preview .custom-article-title {
          color: #016f53 !important;
          font-family: 'Montserrat', sans-serif;
          font-size: 1.4rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .website-preview .custom-article-author {
          color: #666666;
          font-family: 'Georgia', serif;
          font-size: 1rem;
          font-style: italic;
          margin-bottom: 1.5rem;
        }

        .website-preview .section-transparent .custom-article-author {
          color: var(--muted-foreground) !important;
        }

        .website-preview .custom-description {
          font-family: 'Georgia', serif;
          font-size: 1.2rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .website-preview .custom-html-content {
          font-family: 'Georgia', serif;
          font-size: 1.2rem;
          line-height: 1.6;
        }

        .website-preview .custom-html-content p {
          margin-bottom: 1rem;
        }

        .website-preview .custom-html-content h1,
        .website-preview .custom-html-content h2,
        .website-preview .custom-html-content h3,
        .website-preview .custom-html-content h4 {
          color: #016f53 !important;
          font-family: 'Montserrat', sans-serif;
          margin: 1.5rem 0 1rem;
        }

        .website-preview .custom-html-content ul,
        .website-preview .custom-html-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .website-preview .custom-html-content li {
          margin-bottom: 0.5rem;
        }

        .website-preview .custom-html-content blockquote {
          border-left: 4px solid #016f53;
          margin: 1.5rem 0;
          padding-left: 1rem;
          font-style: italic;
        }

        .website-preview .custom-image-figure {
          margin: 1.5rem 0;
        }

        .website-preview .custom-inline-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          object-fit: cover;
        }

        .website-preview .custom-image-caption {
          color: #666666;
          font-family: 'Georgia', serif;
          font-size: 0.9rem;
          font-style: italic;
          margin-top: 0.5rem;
          text-align: center;
        }

        .website-preview .section-transparent .custom-image-caption {
          color: var(--muted-foreground) !important;
        }

        .website-preview .custom-image-gallery {
          margin-top: 1.5rem;
        }

        /* ===== EVENTS & BIRTHDAYS ===== */
        .website-preview .events-birthdays-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        /* Inner cards always have light backgrounds, so force dark text */
        .website-preview .section-transparent .events-birthdays-grid p,
        .website-preview .section-transparent .events-birthdays-grid span,
        .website-preview .section-transparent .events-birthdays-grid li,
        .website-preview .section-transparent .events-birthdays-grid div {
          color: #333333 !important;
        }

        .website-preview .section-transparent .events-birthdays-grid h2,
        .website-preview .section-transparent .events-birthdays-grid strong {
          color: #016f53 !important;
        }

        /* ===== CONTENT IMAGE ===== */
        .website-preview .content-image {
          border-radius: var(--radius);
          width: 100%;
          height: auto;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
        }

        /* ===== CONTAINER QUERY SETUP ===== */
        /* Use container queries so viewport toggles (mobile/tablet/desktop) */
        /* trigger responsive styles based on container width, not browser width */
        .preview-viewport-container {
          container-type: inline-size;
          container-name: preview;
        }

        /* ===== RESPONSIVE BREAKPOINTS (container queries) ===== */
        @container preview (max-width: 1024px) {
          .wp-banner-title {
            font-size: 2.3rem;
          }

          .wp-banner-subtitle {
            font-size: 1.5rem;
          }

          .wp-banner-date {
            font-size: 1.3rem;
          }
        }

        @container preview (max-width: 768px) {
          .wp-newsletter-container {
            font-size: 1.2rem;
            padding: 0 0.5rem;
          }

          .wp-main-content {
            padding: 1.5rem 0;
          }

          .wp-header-title {
            display: none;
          }

          .wp-banner-section {
            margin-top: 10px;
            border-radius: 8px;
          }

          .wp-banner-image-container {
            aspect-ratio: 3/2;
          }

          .wp-banner-text {
            bottom: 24px;
            left: 24px;
            width: 90%;
            gap: 0;
          }

          .wp-banner-title {
            font-size: 2.25rem;
          }

          .wp-banner-subtitle {
            display: none;
          }

          .wp-banner-date {
            font-size: 1.2rem;
          }

          .website-preview .section-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }

          .website-preview .spotlight-text,
          .website-preview .chief-text,
          .website-preview .intern-text,
          .website-preview .basic-text {
            font-size: 1.2rem;
            line-height: 1.7;
          }

          .website-preview .basic-description {
            font-size: 1.2rem;
          }

          .website-preview .chiefs-section,
          .website-preview .interns-section {
            flex-direction: column;
            padding: 1rem;
          }

          .website-preview .chief-column,
          .website-preview .intern-column {
            flex-basis: 100%;
            padding: 1rem;
          }

          .website-preview .chief-image,
          .website-preview .intern-image {
            width: 200px;
            height: 200px;
            display: block;
            margin: 0 0 1rem 0;
          }

          .website-preview .chief-name,
          .website-preview .intern-name {
            font-size: 1.3rem;
            text-align: left;
          }

          .website-preview .chief-text,
          .website-preview .intern-text {
            padding: 0;
            text-align: left;
          }

          .website-preview .toggle-button {
            display: block;
            font-family: 'Georgia', serif;
            margin: 1rem 0 0;
            font-size: 1.2rem;
          }

          .website-preview .spotlight-grid,
          .website-preview .chiefs-grid,
          .website-preview .interns-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .website-preview .spotlight-grid img,
          .website-preview .chiefs-grid img,
          .website-preview .interns-grid img {
            max-width: 250px;
            margin: 0 auto;
          }

          .website-preview .section-card {
            padding: 1.5rem;
          }

          .website-preview .section-card h2 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }

          .website-preview .section-card p {
            font-size: 1.2rem;
          }

          .website-preview .twoColumns {
            flex-direction: column;
          }

          .website-preview .column {
            flex-basis: 100%;
          }

          .website-preview .column:first-child {
            order: 1;
          }

          .website-preview .sectionTitle {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }

          .website-preview .spotlightText {
            font-size: 1.2rem;
            line-height: 1.7;
          }

          .website-preview .featureSubtitle {
            font-size: 1.1rem;
          }

          .website-preview .featureBullets {
            font-size: 1.2rem;
          }

          .website-preview .text-image-grid {
            grid-template-columns: 1fr;
          }

          .website-preview .text-image-float,
          .website-preview .text-image-float.float-left,
          .website-preview .text-image-float.float-right {
            float: none;
            max-width: 100%;
            margin-right: 0;
            margin-left: 0;
            margin-bottom: 1.5rem;
          }

          .website-preview .community-service-image,
          .website-preview .community-service-image.float-left,
          .website-preview .community-service-image.float-right {
            float: none;
            max-width: 100%;
            margin-right: 0;
            margin-left: 0;
            margin-bottom: 1.5rem;
          }

          .website-preview .events-birthdays-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @container preview (max-width: 480px) {
          .wp-banner-text {
            bottom: 16px;
            left: 16px;
            width: 95%;
            gap: 0;
          }

          .wp-banner-title {
            font-size: 1.75rem;
          }

          .wp-banner-subtitle {
            display: none;
          }

          .wp-banner-date {
            font-size: 1.15rem;
          }

          .wp-banner-section {
            border-radius: 6px;
          }

          .website-preview .section-card {
            padding: 1.25rem;
          }

          .wp-header-content {
            padding: 0 16px;
          }

          .wp-newsletter-container {
            padding: 0 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}
