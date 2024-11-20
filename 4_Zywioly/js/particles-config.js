const particlesConfig = {
    water: {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#1E90FF"
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.5,
                random: true,
                animation: {
                    enable: true,
                    speed: 1,
                    minimumValue: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true
            },
            move: {
                enable: true,
                speed: 3,
                direction: "none",
                random: true,
                straight: false,
                outMode: "bounce",
                bounce: false
            }
        },
        interactivity: {
            detectsOn: "canvas",
            events: {
                onHover: {
                    enable: true,
                    mode: "repulse"
                }
            }
        }
    },
    fire: {
        particles: {
            number: {
                value: 100,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ["#FF4500", "#FF8C00", "#FFD700"]
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.6,
                random: true,
                animation: {
                    enable: true,
                    speed: 1,
                    minimumValue: 0.1,
                    sync: false
                }
            },
            size: {
                value: 4,
                random: true,
                animation: {
                    enable: true,
                    speed: 4,
                    minimumValue: 0.1,
                    sync: false
                }
            },
            move: {
                enable: true,
                speed: 6,
                direction: "top",
                random: true,
                straight: false,
                outMode: "out"
            }
        }
    },
    // Podobne konfiguracje dla pozostałych żywiołów...
};