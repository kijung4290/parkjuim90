'use client';

import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { createStat, MAX_PROFILE_STATS } from '../constants';

/**
 * 첫 화면 글귀 슬라이드 아래에 보이는 숫자 카드(활동 지표)를 편집합니다.
 * 예) "자체 개발 복지 솔루션 / 10+ / 개"
 *
 * 이 값은 사이트에 계속 보이고 있었지만 그동안 코드로만 바꿀 수 있었습니다.
 */
export function StatsEditor({ stats = [], onAdd, onUpdate, onRemove, onMove }) {
    return (
        <div className="admin-span-all admin-stats">
            <div className="admin-stats-head">
                <span>
                    활동 지표
                    <em>(첫 화면 글귀 슬라이드 아래에 숫자 카드로 보입니다 · 앞에서 {MAX_PROFILE_STATS}개까지)</em>
                </span>
                <button
                    className="button button--soft button--small"
                    type="button"
                    disabled={stats.length >= MAX_PROFILE_STATS}
                    onClick={() => onAdd(createStat())}
                >
                    <Plus size={15} aria-hidden="true" /> 지표 추가
                </button>
            </div>

            {stats.length === 0 ? (
                <p className="admin-photos-empty">
                    아직 등록한 지표가 없습니다. 비워두면 코드에 들어 있는 기본 지표가 대신 보입니다.
                </p>
            ) : (
                <ul className="admin-stat-list">
                    {stats.map((stat, index) => (
                        <li className={`admin-stat${index >= MAX_PROFILE_STATS ? ' is-hidden-on-site' : ''}`} key={index}>
                            <div className="admin-stat-preview" aria-hidden="true">
                                <strong>{stat.value || '00'}<small>{stat.unit}</small></strong>
                                <span>{stat.label || '설명'}</span>
                            </div>
                            <div className="admin-stat-inputs">
                                <input
                                    value={stat.label || ''}
                                    placeholder="설명 (예: 자체 개발 복지 솔루션)"
                                    aria-label={`${index + 1}번째 지표 설명`}
                                    onChange={(event) => onUpdate(index, { label: event.target.value })}
                                />
                                <input
                                    className="admin-stat-value"
                                    value={stat.value || ''}
                                    placeholder="숫자 (예: 10+)"
                                    aria-label={`${index + 1}번째 지표 숫자`}
                                    onChange={(event) => onUpdate(index, { value: event.target.value })}
                                />
                                <input
                                    className="admin-stat-unit"
                                    value={stat.unit || ''}
                                    placeholder="단위 (예: 개)"
                                    aria-label={`${index + 1}번째 지표 단위`}
                                    onChange={(event) => onUpdate(index, { unit: event.target.value })}
                                />
                            </div>
                            <div className="admin-photo-tools">
                                <button type="button" title="위로" aria-label={`${index + 1}번째 지표 위로`} disabled={index === 0} onClick={() => onMove(index, -1)}><ChevronUp size={15} /></button>
                                <button type="button" title="아래로" aria-label={`${index + 1}번째 지표 아래로`} disabled={index === stats.length - 1} onClick={() => onMove(index, 1)}><ChevronDown size={15} /></button>
                                <button type="button" className="is-danger" title="삭제" aria-label={`${index + 1}번째 지표 삭제`} onClick={() => onRemove(index)}><Trash2 size={15} /></button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
