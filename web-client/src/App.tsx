import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, App as AntdApp, Layout } from 'antd'
import './App.css'
import Navbar from './shared/components/Navbar'
import DashboardPage from './features/dashboard/DashboardPage'
import PesananPage from './features/pesanan/PesananPage'
import PelangganPage from './features/pelanggan/PelangganPage'
import LayananPage from './features/layanan/LayananPage'

const { Content, Footer } = Layout

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0e7490',
          colorPrimaryHover: '#0b5e75',
          colorText: '#0d2a3a',
          colorTextSecondary: '#5b7384',
          colorTextHeading: '#0d2a3a',
          colorBorder: '#dbe8ee',
          borderRadius: 10,
          fontFamily: "'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
          fontSize: 14,
        },
        components: {
          Button: {
            colorPrimary: '#0e7490',
            colorPrimaryHover: '#0b5e75',
            fontWeight: 600,
            borderRadius: 10,
          },
          Table: {
            headerBg: '#f7fbfc',
            headerColor: '#5b7384',
            headerSplitColor: 'transparent',
            rowHoverBg: '#fafdfe',
            borderColor: '#dbe8ee',
          },
        },
      }}
    >
      <AntdApp>
        <BrowserRouter>
          <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
            <Navbar />
            <Content className="main-content">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/pesanan" element={<PesananPage />} />
                <Route path="/pelanggan" element={<PelangganPage />} />
                <Route path="/layanan" element={<LayananPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Content>
            <Footer
              style={{
                textAlign: 'center',
                background: 'transparent',
                color: '#64748b',
                fontSize: 13,
                padding: '20px',
              }}
            >
              WashTech · Kelompok WashTech · Pengembangan Aplikasi berbasis Platform 2026/2027
            </Footer>
          </Layout>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  )
}
