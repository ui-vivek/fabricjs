import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as fabric from 'fabric';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Add event types
interface FabricEvent {
  target: fabric.Object;
}

interface CanvasAction {
  type: 'add' | 'remove' | 'modify';
  object: fabric.Object;
}

@Component({
  selector: 'app-fabric-demo',
  templateUrl: './fabric-demo.component.html',
  styleUrls: ['./fabric-demo.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FabricDemoComponent implements AfterViewInit {
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  private canvas!: fabric.Canvas;
  private history: CanvasAction[] = [];
  private redoStack: CanvasAction[] = [];
  customText: string = '';

  ngAfterViewInit(): void {
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;
    
    this.canvas = new fabric.Canvas(this.canvasElement.nativeElement, {
      width: width,
      height: height,
      backgroundColor: '#f0f0f0',
    });

    // Add proper typing to event handlers
    this.canvas.on('object:added', (e: FabricEvent) => {
      if (e.target) {
        this.history.push({ type: 'add', object: e.target });
        this.redoStack = [];
      }
    });

    this.canvas.on('object:removed', (e: FabricEvent) => {
      if (e.target && !this.isUndoRedoAction) {
        this.history.push({ type: 'remove', object: e.target });
        this.redoStack = [];
      }
    });

    // Initialize canvas with shapes
    this.addRectangle();
    this.addCircle();
    this.addText();
    this.addTriangle();
    this.addEllipse();
    this.addLine();
  }

  private isUndoRedoAction = false;

  addRectangle(): void {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 50,
      fill: 'lightblue',
      stroke: 'black',
      strokeWidth: 2,
    });
    this.canvas.add(rect);
  }

  addCircle(): void {
    const circle = new fabric.Circle({
      radius: 50,
      left: 200,
      top: 200,
      fill: 'lightgreen',
      stroke: 'black',
      strokeWidth: 2,
    });
    this.canvas.add(circle);
  }

  addText(): void {
    const text = new fabric.Textbox('Hello Fabric.js', {
      left: 50,
      top: 50,
      fontSize: 20,
      fill: 'black',
      width: 200,
    });
    this.canvas.add(text);
  }

  addTriangle(): void {
    const triangle = new fabric.Triangle({
      width: 100,
      height: 100,
      left: 300,
      top: 100,
      fill: 'orange',
      stroke: 'black',
      strokeWidth: 2,
    });
    this.canvas.add(triangle);
  }

  addEllipse(): void {
    const ellipse = new fabric.Ellipse({
      rx: 70,
      ry: 40,
      left: 400,
      top: 200,
      fill: 'purple',
      stroke: 'black',
      strokeWidth: 2,
    });
    this.canvas.add(ellipse);
  }

  addLine(): void {
    const line = new fabric.Line([50, 300, 200, 300], {
      stroke: 'red',
      strokeWidth: 2,
    });
    this.canvas.add(line);
  }

  removeSelectedObject(): void {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.remove(activeObject);
    }
  }

  clearCanvas(): void {
    this.canvas.clear();
    this.canvas.backgroundColor = '#f0f0f0';
    this.canvas.renderAll();
  }

  saveCanvasAsImage(): void {
    const dataURL = this.canvas.toDataURL({
      format: 'png',
      quality: 1.0,
      multiplier: 1
    });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'canvas.png';
    link.click();
  }

  changeObjectColor(color: string): void {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      activeObject.set('fill', color);
      this.canvas.renderAll();
    }
  }

  addCustomText(text: string): void {
    if (text) {
      const customText = new fabric.Textbox(text, {
        left: 50,
        top: 50,
        fontSize: 20,
        fill: 'black',
        width: 200,
      });
      this.canvas.add(customText);
      this.customText = '';
    }
  }

  groupObjects(): void {
    const activeObjects = this.canvas.getActiveObjects();
    if (activeObjects.length > 1) {
      const group = new fabric.Group(activeObjects, {
        left: activeObjects[0].left,
        top: activeObjects[0].top,
      });
      this.canvas.add(group);
      this.canvas.remove(...activeObjects);
      this.canvas.renderAll();
    }
  }

  rotateObject(angle: number): void {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      activeObject.rotate(activeObject.angle + angle);
      this.canvas.renderAll();
    }
  }

  undo(): void {
    if (this.history.length > 0) {
      const lastAction = this.history.pop()!;
      this.isUndoRedoAction = true;

      if (lastAction.type === 'add') {
        this.canvas.remove(lastAction.object);
      } else if (lastAction.type === 'remove') {
        this.canvas.add(lastAction.object);
      }

      this.redoStack.push(lastAction);
      this.canvas.renderAll();
      this.isUndoRedoAction = false;
    }
  }

  redo(): void {
    if (this.redoStack.length > 0) {
      const action = this.redoStack.pop()!;
      this.isUndoRedoAction = true;

      if (action.type === 'add') {
        this.canvas.add(action.object);
      } else if (action.type === 'remove') {
        this.canvas.remove(action.object);
      }

      this.history.push(action);
      this.canvas.renderAll();
      this.isUndoRedoAction = false;
    }
  }
}