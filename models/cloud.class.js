class Cloud extends MovableObject{
    y = 20;
    height = 350;
    width = 300;

        constructor(){
        super().loadImage('img/5_background/layers/4_clouds/2.png');

        this.x = Math.random() * 500;
        this.animate();
    }   

    animate() {
        setInterval(() =>{
            this.x -= 0.8 ;
        }, 1000 /  60);
    }
}