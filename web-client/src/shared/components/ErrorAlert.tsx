import { Alert } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'

interface ErrorAlertProps {
  message: string
  description?: string
  onRetry?: () => void
}

export default function ErrorAlert({ message, description, onRetry }: ErrorAlertProps) {
  return (
    <Alert
      title={
        <div className="error-alert-header">
          <CloseCircleFilled className="error-alert-icon" />
          <span className="error-alert-title">{message}</span>
        </div>
      }
      description={
        <div className="error-alert-body">
          <p className="error-alert-text">
            {description ?? 'Terjadi kesalahan saat memuat data.'}
          </p>
          {onRetry && (
            <div className="error-alert-action">
              <button type="button" className="btn btn-sm btn-primary" onClick={onRetry}>
                Coba Lagi
              </button>
            </div>
          )}
        </div>
      }
      type="error"
      showIcon={false}
      className="custom-error-alert"
    />
  )
}

