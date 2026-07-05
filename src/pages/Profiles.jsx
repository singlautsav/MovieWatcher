import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Plus, User, Trash2 } from 'lucide-react';

const COLORS = ['#e50914', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const Profiles = () => {
  const { data, setActiveProfileId, createProfile, deleteProfile } = useUser();
  const [isCreating, setIsCreating] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      const color = COLORS[data.profiles.length % COLORS.length];
      createProfile(newProfileName.trim(), color);
      setNewProfileName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="profiles-page">
      <div className="profiles-container">
        <h1>Who's watching?</h1>
        
        <div className="profiles-list">
          {data.profiles.map(p => (
            <div key={p.id} className="profile-card">
              <div 
                className="profile-avatar" 
                style={{ backgroundColor: p.color }}
                onClick={() => setActiveProfileId(p.id)}
              >
                <User size={60} color="white" />
              </div>
              <h3>{p.name}</h3>
              <button className="delete-profile" onClick={() => deleteProfile(p.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {data.profiles.length < 5 && !isCreating && (
            <div className="profile-card">
              <div className="profile-avatar add-profile" onClick={() => setIsCreating(true)}>
                <Plus size={60} color="white" />
              </div>
              <h3>Add Profile</h3>
            </div>
          )}
        </div>

        {isCreating && (
          <form className="create-profile-form glass-panel" onSubmit={handleCreate}>
            <h2>Add Profile</h2>
            <input 
              type="text" 
              placeholder="Name" 
              value={newProfileName}
              onChange={e => setNewProfileName(e.target.value)}
              autoFocus
              maxLength={15}
            />
            <div className="form-buttons">
              <button type="button" className="btn cancel-btn" onClick={() => setIsCreating(false)}>Cancel</button>
              <button type="submit" className="btn submit-btn">Create</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default Profiles;
