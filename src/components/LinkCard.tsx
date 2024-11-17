import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Copy, BarChart2, Check } from 'lucide-react';
import {format} from 'date-fns';

interface LinkCardProps {
  id:string;
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
              className={`btn btn-outline-primary ${
                isCopied ? 'btn-success text-white' : ''
              }`}
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              {
                isCopied ? 
                  <Check size={18}/>
                :  <Copy size={18} />
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
            <ExternalLink size={14} className="ms-1 text-primary" style={{marginTop: -5}} />
          </a>
         
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <small className="text-secondary">Created: {format(created_at, 'dd-MMM-yyyy')}</small>
          <Link to={`/analytics?id=${id}`} className="btn btn-sm btn-primary">
            <BarChart2 size={18} className="me-1" />
            Analytics
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;