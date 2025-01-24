import React from 'react';

const Settings = ({ onClose }) => {
  // You can add your settings logic here.
  // For now, let's add a simple form field as an example.

  const [theme, setTheme] = React.useState('dark');

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    // You can add your logic to update the theme here.
    console.log(`Theme changed to: ${e.target.value}`);
  };

  return (
    <div className="settings-modal">
      <div className="modal-header">
        <h2>Settings</h2>
        <div className="settings-icon" onClick={onClose}>
          ⚙️
        </div>
      </div>
      <div className="modal-body">
        <div className="setting-item">
          <label htmlFor="theme">Theme</label>
          <select id="theme" value={theme} onChange={handleThemeChange}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        {/* Add more settings here as needed */}
      </div>
      <div className="modal-footer">
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Settings;
