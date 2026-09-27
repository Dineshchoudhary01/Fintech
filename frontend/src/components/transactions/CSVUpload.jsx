import { useState, useRef } from 'react';
import { uploadTransactionsCSV } from '../../api/transactionApi';

function CSVUpload({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setResult(null);

    try {
      const response = await uploadTransactionsCSV(file);
      setResult(response.data);
      onUploadComplete();
    } catch (error) {
      setResult({ msg: error.response?.data?.msg || 'Upload failed', imported: 0, failed: 0, errors: [] });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        id="csv-upload"
      />
      <label
        htmlFor="csv-upload"
        className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition cursor-pointer inline-block"
      >
        {uploading ? 'Uploading...' : 'Upload CSV'}
      </label>

      {result && (
        <div className="mt-3 text-sm bg-slate-50 border border-slate-200 rounded-lg p-3">
          <p className="text-slate-700">
            Imported: <span className="font-medium text-green-600">{result.imported}</span>{' '}
            | Failed: <span className="font-medium text-red-600">{result.failed}</span>
          </p>
          {result.errors?.length > 0 && (
            <ul className="mt-2 text-xs text-red-500 list-disc list-inside">
              {result.errors.map((err, i) => (
                <li key={i}>{err.reason}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default CSVUpload;