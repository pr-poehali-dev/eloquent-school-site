import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function AngryBirdsGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const birdRef = useRef<Matter.Body | null>(null);
  const [score, setScore] = useState(0);
  const [birdsLeft, setBirdsLeft] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<'ready' | 'aiming' | 'flying' | 'over'>('ready');
  const [mouseDown, setMouseDown] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Mouse = Matter.Mouse;
    const MouseConstraint = Matter.MouseConstraint;
    const Events = Matter.Events;

    const engine = Engine.create({
      gravity: { x: 0, y: 1 }
    });
    engineRef.current = engine;

    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 1200,
        height: 600,
        wireframes: false,
        background: '#87CEEB'
      }
    });

    const ground = Bodies.rectangle(600, 590, 1200, 20, {
      isStatic: true,
      render: { fillStyle: '#8B4513' }
    });

    const slingshotBase = Bodies.rectangle(150, 450, 20, 100, {
      isStatic: true,
      render: { fillStyle: '#654321' }
    });

    const slingshotLeft = Bodies.rectangle(140, 400, 10, 80, {
      isStatic: true,
      render: { fillStyle: '#8B4513' }
    });

    const slingshotRight = Bodies.rectangle(160, 400, 10, 80, {
      isStatic: true,
      render: { fillStyle: '#8B4513' }
    });

    const createBird = () => {
      const bird = Bodies.circle(150, 400, 15, {
        density: 0.004,
        restitution: 0.8,
        friction: 0.3,
        render: { fillStyle: '#FF0000' }
      });
      birdRef.current = bird;
      return bird;
    };

    const createBox = (x: number, y: number, width: number, height: number, color: string) => {
      return Bodies.rectangle(x, y, width, height, {
        density: 0.001,
        restitution: 0.3,
        friction: 0.5,
        render: { fillStyle: color }
      });
    };

    const createPig = (x: number, y: number) => {
      return Bodies.circle(x, y, 20, {
        density: 0.002,
        restitution: 0.5,
        friction: 0.5,
        render: { fillStyle: '#00FF00' },
        label: 'pig'
      });
    };

    const createLevel1 = () => {
      const boxes: Matter.Body[] = [];
      
      boxes.push(createBox(800, 500, 80, 120, '#8B4513'));
      boxes.push(createBox(900, 500, 80, 120, '#8B4513'));
      boxes.push(createBox(850, 420, 120, 20, '#654321'));
      boxes.push(createBox(850, 370, 60, 80, '#A0522D'));
      
      boxes.push(createBox(700, 520, 20, 80, '#8B4513'));
      boxes.push(createBox(780, 520, 20, 80, '#8B4513'));
      boxes.push(createBox(740, 470, 80, 20, '#654321'));
      
      const pig1 = createPig(850, 340);
      const pig2 = createPig(740, 440);
      const pig3 = createPig(850, 480);
      
      return [...boxes, pig1, pig2, pig3];
    };

    const bird = createBird();
    const levelObjects = createLevel1();

    World.add(engine.world, [
      ground,
      slingshotBase,
      slingshotLeft,
      slingshotRight,
      bird,
      ...levelObjects
    ]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    World.add(engine.world, mouseConstraint);

    Events.on(mouseConstraint, 'startdrag', (event) => {
      if (event.body === birdRef.current && gameState === 'ready') {
        setGameState('aiming');
        setMouseDown(true);
        setDragStart({ x: 150, y: 400 });
      }
    });

    Events.on(mouseConstraint, 'enddrag', (event) => {
      if (event.body === birdRef.current && gameState === 'aiming') {
        setMouseDown(false);
        const bird = birdRef.current;
        if (bird) {
          const force = {
            x: (150 - bird.position.x) * 0.05,
            y: (400 - bird.position.y) * 0.05
          };
          Matter.Body.applyForce(bird, bird.position, force);
          setGameState('flying');
          
          setTimeout(() => {
            setBirdsLeft(prev => prev - 1);
            setGameState('ready');
            
            if (birdsLeft > 1) {
              World.remove(engine.world, bird);
              const newBird = createBird();
              World.add(engine.world, newBird);
            } else {
              setGameState('over');
            }
          }, 5000);
        }
      }
    });

    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA.label === 'pig' || pair.bodyB.label === 'pig') {
          const pig = pair.bodyA.label === 'pig' ? pair.bodyA : pair.bodyB;
          const speed = Math.sqrt(pig.velocity.x ** 2 + pig.velocity.y ** 2);
          
          if (speed > 3) {
            setScore(prev => prev + 100);
            World.remove(engine.world, pig);
          }
        }
      });
    });

    Engine.run(engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, [level]);

  const resetGame = () => {
    setScore(0);
    setBirdsLeft(3);
    setLevel(1);
    setGameState('ready');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🐦 Angry Birds Clone</h1>
            <p className="text-gray-600">Перетащи птицу и отпусти, чтобы запустить!</p>
          </div>
          
          <div className="flex gap-4">
            <Card className="px-6 py-3">
              <div className="flex items-center gap-2">
                <Icon name="Target" size={20} className="text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Очки</p>
                  <p className="text-2xl font-bold">{score}</p>
                </div>
              </div>
            </Card>
            
            <Card className="px-6 py-3">
              <div className="flex items-center gap-2">
                <Icon name="Bird" size={20} className="text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Птицы</p>
                  <p className="text-2xl font-bold">{birdsLeft}</p>
                </div>
              </div>
            </Card>
            
            <Card className="px-6 py-3">
              <div className="flex items-center gap-2">
                <Icon name="Trophy" size={20} className="text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-500">Уровень</p>
                  <p className="text-2xl font-bold">{level}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-4 mb-6">
          <canvas ref={canvasRef} className="rounded-xl" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow">
              <div className={`w-3 h-3 rounded-full ${gameState === 'ready' ? 'bg-green-500' : gameState === 'aiming' ? 'bg-yellow-500' : gameState === 'flying' ? 'bg-blue-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium">
                {gameState === 'ready' ? 'Готов к запуску' : 
                 gameState === 'aiming' ? 'Прицеливание...' : 
                 gameState === 'flying' ? 'В полёте!' : 
                 'Игра окончена'}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={resetGame}>
              <Icon name="RotateCcw" size={18} className="mr-2" />
              Начать заново
            </Button>
            
            {gameState === 'over' && (
              <Button onClick={resetGame} className="bg-gradient-to-r from-orange-500 to-red-500">
                <Icon name="Play" size={18} className="mr-2" />
                Играть снова
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Icon name="MousePointer" size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Управление</h3>
                <p className="text-sm text-gray-600">Зажми красную птицу мышкой, оттяни назад и отпусти</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Icon name="Target" size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Цель</h3>
                <p className="text-sm text-gray-600">Уничтожь всех зелёных свиней, разрушив конструкции</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Icon name="Zap" size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Очки</h3>
                <p className="text-sm text-gray-600">100 очков за каждую побеждённую свинью</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
