import React from 'react';
import './SeatMap.css';

// 남은 시간을 계산하는 함수
const calculateRemainingTime = (endTimeString) => {
    if (!endTimeString) return '정보 없음';
    const now = new Date();
    const endTime = new Date(endTimeString + 'Z');
    const diffMs = endTime - now;

    if (diffMs > 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${diffHours}시간 ${diffMinutes}분 남음`;
    } else {
        return '만료됨';
    }
};

function SeatMap({ seats, activeSeatId, selectedSeatId, onSeatClick }) {
    return (
        <div>
            <div className="seat-map-container">
                {seats.map(item => {
                    const { id, type, seatNumber, text, gridRow, gridColumn, gridColumnEnd, status, endTime } = item;
                    const style = {
                        gridRow: gridRow,
                        gridColumn: `${gridColumn} / ${gridColumnEnd || `span 1`}`,
                    };

                    if (type === 'seat') {
                        let seatStatusClass = '';
                        if (id === activeSeatId) {
                            seatStatusClass = 'seat-my-reservation';
                        } else if (status === 'OCCUPIED') {
                            seatStatusClass = 'seat-occupied';
                        } else {
                            seatStatusClass = 'seat-available';
                        }
                        const isSelected = id === selectedSeatId;

         
                        return (
                            <div
                                key={id}
                                style={style}
                                className={`map-item seat ${seatStatusClass} ${isSelected ? 'seat-selected' : ''}`}
                                onClick={() => onSeatClick(item)}
                            >
                                <div className="seat-number">{seatNumber}</div>
                                <div className="seat-status">
                        
                                    {status === 'AVAILABLE' ? '사용 가능' : calculateRemainingTime(endTime)}
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div key={id} style={style} className="map-item label">
                                {text}
                            </div>
                        );
                    }
                })}
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
          
                <ul style={{ listStyle: 'none', display: 'inline-flex', gap: '20px', padding: 0 }}>
                    <li><span className="legend-box seat-available"></span>선택 가능</li>
                    <li><span className="legend-box seat-occupied"></span>사용 중</li>
                    <li><span className="legend-box seat-my-reservation"></span>내 좌석</li>
                </ul>
            </div>
        </div>
    );
}

export default SeatMap;