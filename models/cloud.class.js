class Cloud extends MovableObject{
    y = 20;
    height = 350;
    width = 300;

        constructor(){
        super().loadImage('img/5_background/layers/4_clouds/2.png');

        this.x = 200 + Math.random() * 500;
    
    
    }   

}