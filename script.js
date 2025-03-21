// script.js
document.addEventListener('DOMContentLoaded', () => {
    // 葉っぱのインタラクティブアニメーション
    const leaves = document.querySelectorAll('.leaf');
    
    leaves.forEach(leaf => {
        leaf.addEventListener('mouseenter', () => {
            gsap.to(leaf, {
                scale: 1.2,
                rotation: () => gsap.utils.random(-15, 15),
                duration: 0.5
            });
        });
        
        leaf.addEventListener('mouseleave', () => {
            gsap.to(leaf, {
                scale: 1,
                rotation: 0,
                duration: 0.3
            });
        });
    });

    // スクロール連動アニメーション
    gsap.utils.toArray('.leaf').forEach(leaf => {
        gsap.from(leaf, {
            scrollTrigger: {
                trigger: leaf,
                start: 'top center',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 100,
            duration: 1
        });
    });

    // ランダムな葉っぱの動き
    setInterval(() => {
        leaves.forEach(leaf => {
            if(Math.random() > 0.8) {
                gsap.to(leaf, {
                    x: `+=${gsap.utils.random(-50,50)}`,
                    y: `+=${gsap.utils.random(-30,30)}`,
                    rotation: `+=${gsap.utils.random(-45,45)}`,
                    duration: 3,
                    ease: 'power2.inOut'
                });
            }
        });
    }, 3000);
});
