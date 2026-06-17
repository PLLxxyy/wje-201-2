import { useMemo } from 'react';
import { cocktails } from '../data';
import type { Cocktail } from '../types';

interface Props {
  ids: string[];
  goBack: () => void;
  openDetail: (id: string) => void;
}

export function ComparePage({ ids, goBack, openDetail }: Props) {
  const selected = useMemo(
    () => ids.map(id => cocktails.find(c => c.id === id)).filter(Boolean) as Cocktail[],
    [ids],
  );

  if (selected.length < 2) {
    return (
      <div className="detail-page">
        <button className="back-btn" onClick={goBack}>
          ← 返回收藏夹
        </button>
        <div className="empty-state">
          <span className="icon">🤔</span>
          <h3>请至少选择 2 款鸡尾酒进行对比</h3>
          <p>返回收藏夹重新选择</p>
        </div>
      </div>
    );
  }

  const allIngredientNames = useMemo(() => {
    const set = new Set<string>();
    selected.forEach(c => c.ingredients.forEach(i => set.add(i.name)));
    return Array.from(set);
  }, [selected]);

  const ingredientSharedMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    allIngredientNames.forEach(name => {
      map[name] = selected.every(c => c.ingredients.some(i => i.name === name));
    });
    return map;
  }, [allIngredientNames, selected]);

  const maxSteps = Math.max(...selected.map(c => c.steps.length));

  return (
    <div
      className="compare-page"
      style={{ ['--compare-cols' as any]: selected.length }}
    >
      <button className="back-btn" onClick={goBack}>
        ← 返回收藏夹
      </button>

      <div className="compare-header">
        <h1 className="compare-title">📊 配方对比</h1>
        <p className="compare-subtitle">
          共对比 <span className="results-count">{selected.length}</span> 款鸡尾酒
        </p>
      </div>

      <div className="compare-legend">
        <span className="legend-item">
          <span className="legend-dot legend-common" /> 共有
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-unique" /> 独有
        </span>
      </div>

      <div className="compare-section">
        <div className="compare-row compare-sticky-header">
          <div className="compare-label-col">项目</div>
          {selected.map(c => (
            <div key={c.id} className="compare-col compare-col-header">
              <div className="compare-color-strip" style={{ background: c.color }} />
              <div
                className="compare-col-title"
                onClick={() => openDetail(c.id)}
                role="button"
              >
                <div className="compare-name">{c.name}</div>
                <div className="compare-name-en">{c.nameEn}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-label-col">基酒</div>
          {selected.map(c => (
            <div key={c.id} className="compare-col">
              <span className="tag tag-spirit">{c.baseSpirit}</span>
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-label-col">酒精度</div>
          {selected.map(c => (
            <div key={c.id} className="compare-col">
              <span className="tag tag-alc">酒精 {c.abv}%</span>
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-label-col">难度</div>
          {selected.map(c => (
            <div key={c.id} className="compare-col">
              <span className="difficulty-stars">
                {'★'.repeat(c.difficulty)}{'☆'.repeat(5 - c.difficulty)}
              </span>
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-label-col">配料种类</div>
          {selected.map(c => (
            <div key={c.id} className="compare-col">
              <span className="compare-stat">{c.ingredients.length} 种</span>
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-label-col">调制步数</div>
          {selected.map(c => (
            <div key={c.id} className="compare-col">
              <span className="compare-stat">{c.steps.length} 步</span>
            </div>
          ))}
        </div>
      </div>

      <div className="compare-section">
        <div className="compare-row compare-section-title-row">
          <div className="compare-section-title">
            <span className="icon">🧂</span> 配料对比
          </div>
        </div>

        {allIngredientNames.map(name => {
          const isCommon = ingredientSharedMap[name];
          return (
            <div
              key={name}
              className={`compare-row compare-ingredient-row ${
                isCommon ? 'row-common' : 'row-unique'
              }`}
            >
              <div className="compare-label-col compare-ingredient-name">
                {name}
                {isCommon ? (
                  <span className="ingredient-badge badge-common">共有</span>
                ) : (
                  <span className="ingredient-badge badge-unique">独有</span>
                )}
              </div>
              {selected.map(c => {
                const ing = c.ingredients.find(i => i.name === name);
                return (
                  <div key={c.id} className="compare-col">
                    {ing ? (
                      <span className="compare-amount">{ing.amount}</span>
                    ) : (
                      <span className="compare-empty">—</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="compare-section">
        <div className="compare-row compare-section-title-row">
          <div className="compare-section-title">
            <span className="icon">📋</span> 步骤对比
          </div>
        </div>

        {Array.from({ length: maxSteps }).map((_, stepIdx) => (
          <div key={stepIdx} className="compare-row compare-step-row">
            <div className="compare-label-col">
              <span className="compare-step-number">第 {stepIdx + 1} 步</span>
            </div>
            {selected.map(c => (
              <div key={c.id} className="compare-col">
                {c.steps[stepIdx] ? (
                  <div className="compare-step-text">{c.steps[stepIdx]}</div>
                ) : (
                  <span className="compare-empty">—</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="compare-section">
        <div className="compare-row compare-section-title-row">
          <div className="compare-section-title">
            <span className="icon">💡</span> 调制技巧
          </div>
        </div>

        <div className="compare-row">
          <div className="compare-label-col">技巧</div>
          {selected.map(c => (
            <div key={c.id} className="compare-col">
              <div className="tip-box compare-tip-box">{c.tips}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
