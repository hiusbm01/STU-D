// 각 좌석의 정보와 그리드 좌표를 담고 있는 배열입니다.
// 이 좌표값만 수정하면 배치도를 자유롭게 변경할 수 있습니다.
export const seatData = [
  // 1열
  { id: 1, type: 'seat', seatNumber: '1', status: 'AVAILABLE', gridRow: 8, gridColumn: 2 },
  { id: 2, type: 'seat', seatNumber: '2', status: 'AVAILABLE', gridRow: 8, gridColumn: 3 },
  { id: 3, type: 'seat', seatNumber: '3', status: 'AVAILABLE', gridRow: 8, gridColumn: 4 },

  // 2열
  { id: 4, type: 'seat', seatNumber: '4', status: 'AVAILABLE', gridRow: 8, gridColumn: 6 },
  { id: 5, type: 'seat', seatNumber: '5', status: 'AVAILABLE', gridRow: 8, gridColumn: 7 },
  { id: 6, type: 'seat', seatNumber: '6', status: 'AVAILABLE', gridRow: 8, gridColumn: 8 },

  // 3열 (스터디존)
  { id: 'label-study', type: 'label', text: 'Study Zone', gridRow: 2, gridColumn: 2, gridColumnEnd: 6 },
  { id: 7, type: 'seat', seatNumber: '7', status: 'AVAILABLE', gridRow: 3, gridColumn: 3 },
  { id: 8, type: 'seat', seatNumber: '8', status: 'AVAILABLE', gridRow: 3, gridColumn: 4 },
  { id: 9, type: 'seat', seatNumber: '9', status: 'AVAILABLE', gridRow: 4, gridColumn: 3 },
  { id: 10, type: 'seat', seatNumber: '10', status: 'AVAILABLE', gridRow: 4, gridColumn: 4 },
  
  // 4열 (카페존)
  { id: 'label-cafe', type: 'label', text: 'Cafe Zone', gridRow: 5, gridColumn: 7, gridColumnEnd: 10 },
  { id: 11, type: 'seat', seatNumber: '11', status: 'AVAILABLE', gridRow: 6, gridColumn: 8 },
  { id: 12, type: 'seat', seatNumber: '12', status: 'AVAILABLE', gridRow: 6, gridColumn: 9 },
  { id: 13, type: 'seat', seatNumber: '13', status: 'AVAILALBE', gridRow: 7, gridColumn: 8 },
  { id: 14, type: 'seat', seatNumber: '14', status: 'AVAILABLE', gridRow: 7, gridColumn: 9 },

  // 5열
  { id: 15, type: 'seat', seatNumber: '15', status: 'AVAILABLE', gridRow: 10, gridColumn: 5, gridColumnEnd: 7 },
];