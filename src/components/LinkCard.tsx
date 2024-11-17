import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Copy, BarChart2, Check } from 'lucide-react';
import { format } from 'date-fns';
import { QrCodeIcon, DownloadIcon } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface LinkCardProps {
  id: string;
  title: string;
  shorten_url: string;
  destination_url: string;
  click_count: number;
  created_at: string;
}

const LinkCard: React.FC<LinkCardProps> = ({
  id,
  title,
  shorten_url,
  destination_url,
  click_count,
  created_at,
}) => {

  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shorten_url}`)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
  }

  const qrRef = useRef<HTMLDivElement>(null)

  const downloadQRCode = () => {
    if (!qrRef.current) return;

    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');

      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${title}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(url); // Clean up
    };

    img.src = url;
  };


  return (
    <div className="card mb-3 animate-fade-in">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h4 className="card-title mb-0 text-light">{title}</h4>
          <span className="badge bg-success">{click_count} views</span>
        </div>

        <div className="mb-2">
          <small className="text-secondary d-block mb-1">Short URL:</small>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={`${shorten_url}`}
              readOnly
            />
            <button
              className={`btn btn-outline-primary ${isCopied ? 'btn-success text-white' : ''
                }`}
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              {
                isCopied ?
                  <Check size={18} />
                  : <Copy size={18} />
              }

            </button>
          </div>
        </div>
        <small className="text-secondary d-block">Original URL:</small>
        <div className="mb-3 d-flex align-items-center">

          <a
            href={destination_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-truncate d-block text-decoration-none"
          >
            {destination_url}
            <ExternalLink size={14} className="ms-1 text-primary" style={{ marginTop: -5 }} />
          </a>

        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div>

            <small className="text-secondary">Created: {format(created_at, 'dd-MMM-yyyy')}</small>
          </div>
          <div>
            <Link to={`/analytics?id=${id}`} className="btn btn-sm btn-primary me-2">
              <BarChart2 size={18} className="me-1" />
              Analytics
            </Link>
            <button data-bs-toggle="modal" data-bs-target={`#modal-${id}`} disabled={!shorten_url} className="btn btn-sm btn-primary">
              <QrCodeIcon size={20} /> QR Code
            </button>

            <div className="modal fade modal-dark-custom" id={`modal-${id}`} aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5 text-light">{title}</h1>
                  </div>
                  <div className="modal-body row">
                    <div ref={qrRef} className='col-md-12 d-flex justify-content-center'>
                      {
                        shorten_url ?
                          <QRCodeSVG
                            value={shorten_url}
                            size={200}
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"M"}
                          /> : ""
                      }
                    </div>
                    <div  className='col-md-12 d-flex justify-content-center mt-4'>
                      <span className='text-light'>{shorten_url}</span>
                    </div>
                    <div  className='col-md-12 d-flex justify-content-center align-items-center mt-2'>
                      <button onClick={downloadQRCode} className='btn btn-primary btn-sm'>Download QR <DownloadIcon size={14}/></button>
                    </div>
                    
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;