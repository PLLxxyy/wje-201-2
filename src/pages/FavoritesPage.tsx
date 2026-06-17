import { useState } from 'react';
import { cocktails } from '../data';

interface Props {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  openDetail: (id: string) => void;
  goHome: () => void;
  openCompare: (ids: string[]) => void;
}

export function FavoritesPage({
  favorites,
  toggleFavorite,
  openDetail,
  goHome,
  openCompare,
}: Props) {
  const [compareMode, setCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const favCocktails = cocktails.filter(c => favorites.includes(c.id));

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selectedIds.length === favCocktails.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(favCocktails.map(c => c.id));
    }
  };

  const exitCompareMode = () => {
    setCompareMode(false);
    setSelectedIds([]);
  };

  const handleCompare = () => {
    if (selectedIds.length >= 2) {
      openCompare(selectedIds);
    }
  };

  if (favCocktails.length === 0) {
    return (
      <main className="main-content">
        <div className="empty-state">
          <span className="icon">💔</span>
          <h3>收藏夹是空的</h3>
          <p>去首页探索鸡尾酒，把喜欢的加入收藏吧！</p>
          <button
            className="detail-fav-btn"
            style={{ marginTop: 20 }}
            onClick={goHome}
          >
            去首页看看
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <div className="fav-toolbar">
        <div className="results-info">
          收藏夹中共有 <span className="results-count">{favCocktails.length}</span> 款鸡尾酒
        </div>
        <div className="fav-actions">
          {!compareMode ? (
            <button
              className="compare-entry-btn"
              onClick={() => setCompareMode(true)}
              disabled={favCocktails.length < 2}
              title={favCocktails.length < 2 ? '至少需要 2 款才能对比' : ''}
            >
              ⚖️ 进入对比模式
            </button>
          ) : (
            <>
              <button className="compare-selectall-btn" onClick={selectAll}>
                {selectedIds.length === favCocktails.length ? '取消全选' : '全选'}
              </button>
              <span className="compare-selected-info">
                已选 <span className="results-count">{selectedIds.length}</span> 款
              </span>
              <button
                className="compare-start-btn"
                onClick={handleCompare}
                disabled={selectedIds.length < 2}
                title={selectedIds.length < 2 ? '至少选择 2 款进行对比' : ''}
              >
                📊 开始对比
              </button>
              <button className="compare-cancel-btn" onClick={exitCompareMode}>
                取消
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card-grid">
        {favCocktails.map(c => {
          const isSelected = selectedIds.includes(c.id);
          return (
            <div
              key={c.id}
              className={`cocktail-card ${isSelected ? 'card-selected' : ''}`}
              onClick={() => {
                if (compareMode) {
                  toggleSelect(c.id);
                } else {
                  openDetail(c.id);
                }
              }}
            >
              {compareMode && (
                <div className={`card-checkbox ${isSelected ? 'checked' : ''}`}>
                  {isSelected && '✓'}
                </div>
              )}
              <div className="card-color-strip" style={{ background: c.color }} />
              <div className="card-body">
                <div className="card-header">
                  <div>
                    <div className="card-name">{c.name}</div>
                    <div className="card-name-en">{c.nameEn}</div>
                  </div>
                  {!compareMode && (
                    <button
                      className="fav-btn"
                      onClick={e => {
                        e.stopPropagation();
                        toggleFavorite(c.id);
                      }}
                      title="取消收藏"
                    >
                      ❤️
                    </button>
                  )}
                </div>
                <div className="card-meta">
                  <span className="tag tag-spirit">{c.baseSpirit}</span>
                  <span className="tag tag-alc">酒精 {c.abv}%</span>
                  <span className="difficulty-stars">
                    {'★'.repeat(c.difficulty)}{'☆'.repeat(5 - c.difficulty)}
                  </span>
                </div>
                <div className="card-flavor">{c.flavor}</div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
