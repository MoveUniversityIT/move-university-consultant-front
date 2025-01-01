import React, { useEffect } from "react";

const MapsTest = () => {
    useEffect(() => {
        const container = document.getElementById("map");
        const options = {
            center: new kakao.maps.LatLng(37.5554765598174, 127.075350846159), // 군자동 위치
            level: 3
        };

        // 지도 생성
        const map = new kakao.maps.Map(container, options);

        // 마커 생성
        const markerPosition = new kakao.maps.LatLng(37.5554765598174, 127.075350846159);
        const marker = new kakao.maps.Marker({
            position: markerPosition // 마커 위치
        });

        // 마커를 지도에 추가
        marker.setMap(map);

        // 반경 500미터 원 생성
        const circle = new kakao.maps.Circle({
            center: markerPosition, // 원의 중심 좌표
            radius: 500, // 반경 (미터 단위)
            strokeWeight: 5, // 선의 두께
            strokeColor: "#FF0000", // 선의 색깔
            strokeOpacity: 0.8, // 선의 투명도
            strokeStyle: "dashed", // 선 스타일 (solid, dashed 등)
            fillColor: "#f49f58", // 채우기 색깔
            fillOpacity: 0.2 // 채우기 투명도
        });

        // 원을 지도에 추가
        circle.setMap(map);

        // 난이도 정보
        const difficultyLevel = 5;

        // 인포윈도우 생성
        const infoWindow = new kakao.maps.InfoWindow({
            content: `<div style="padding:5px; color:black; transition: opacity 0.3s;">난이도: ${difficultyLevel}</div>`, // 표시할 내용
            removable: true // 닫기 버튼 표시
        });

        kakao.maps.event.addListener(map, "click", (mouseEvent) => {
            const clickPosition = mouseEvent.latLng; // 클릭된 위치의 좌표
            const distance = kakao.maps.geometry.spherical.computeDistanceBetween(markerPosition, clickPosition);

            // 클릭 위치가 원 내부일 경우
            if (distance <= circle.getRadius()) {
                infoWindow.open(map, marker); // 마커 위에 인포윈도우 표시
            } else {
                infoWindow.close(); // 원 밖을 클릭하면 인포윈도우 닫기
            }
        });
    }, []);

    return <div id="map" className="h-screen w-screen"></div>;
};

export default MapsTest;
