import { ThisReceiver } from '@angular/compiler';
import { Directive, ElementRef, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { Cursor } from './cursor';

interface Ctx {
  data: object;
}

@Directive({
  selector: '[libMugenScrollData]'
})
export class MugenScrollDataDirective {

  private datasMap: Map<string, object>;
  private viewRefsMap: Map<string, EmbeddedViewRef<object>>;

  /**
   * @ignore
   */
  public bottom: object | undefined;

  /**
   * @ignore
   */
  public top: object | undefined;

  /**
   * @ignore
   */
  public max: number;

  /**
   * @ignore
   */
  public newCursor: (v: object) => Cursor;

  /**
   * @ignore
   */
  constructor(
    private template: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
  ) {
    this.datasMap = new Map<string, object>();
    this.viewRefsMap = new Map<string, EmbeddedViewRef<object>>();
    this.max = 30;
    this.newCursor = (v: object) => new Cursor([v.toString()]);
  }

  /**
   * @ignore
   */
  clear(): void {
    this.viewContainer.clear();
    this.top = undefined;
    this.bottom = undefined;
    this.datasMap.clear();
    this.viewRefsMap.clear();
  }

  /**
   * @ignore
   */
  get length(): number {
    return this.viewContainer.length;
  }

  /**
   * @ignore
   */
  push(...datas: Array<object>): void {
    datas.forEach(data => {
      const cursor = this.newCursor(data);
      if (this.datasMap.has(cursor.toString()) === true) {
        return;
      }
      if (this.top === undefined) {
        this.top = data;
      }
      const ctx: Ctx = { data };
      const r = this.viewContainer.createEmbeddedView(this.template, ctx);
      r.rootNodes[0].setAttribute('_cursor', this.newCursor(data));
      r.detectChanges(); // Wait until data is attached???
      this.datasMap.set(cursor.toString(), data);
      this.viewRefsMap.set(cursor.toString(), r);
      this.bottom = data;
    });
  }

  /**
   * @ignore
   */
  unshift(...datas: Array<object>): void {
    datas.reverse().forEach(data => {
      const cursor = this.newCursor(data);
      if (this.datasMap.has(cursor.toString()) === true) {
        return;
      }
      if (this.bottom === undefined) {
        this.bottom = data;
      }
      const ctx: Ctx = { data };
      const r = this.viewContainer.createEmbeddedView(this.template, ctx, 0);
      r.rootNodes[0].setAttribute('_cursor', this.newCursor(data));
      r.detectChanges(); // Wait until data is attached???
      this.datasMap.set(cursor.toString(), data);
      this.viewRefsMap.set(cursor.toString(), r);
      this.top = data;
    });
  }

  /**
   * @ignore
   */
  public arrangeAfterPush(): void {
    const n = this.viewContainer.length - this.max;
    for (let i = 0; i < n; i++) {
      this.viewContainer.remove(0);
      if (this.top) {
        const cursor = this.newCursor(this.top);
        this.datasMap.delete(cursor.toString());
        this.viewRefsMap.delete(cursor.toString());
      }
      const ref = this.viewContainer.get(0);
      if (ref === null) {
        break;
      }
      const vref: EmbeddedViewRef<object> = ref as EmbeddedViewRef<object>;
      const ctx = vref.context as Ctx;
      this.top = ctx.data;
    }
    return;
  }

  /**
   * @ignore
   */
  public arrangeAfterUnshift(): void {
    const n = this.viewContainer.length - this.max;
    for (let i = 0; i < n; i++) {
      let j = this.viewContainer.length - 1;
      this.viewContainer.remove(j);
      if (this.bottom) {
        const cursor = this.newCursor(this.bottom);
        this.datasMap.delete(cursor.toString());
        this.viewRefsMap.delete(cursor.toString());
      }
      j = this.viewContainer.length - 1;
      const ref = this.viewContainer.get(j);
      if (ref === null) {
        break;
      }
      const vref: EmbeddedViewRef<object> = ref as EmbeddedViewRef<object>;
      const ctx = vref.context as Ctx;
      this.bottom = ctx.data;
    }
  }

  public getPrevData(data: object): object | undefined {
    const v = this.viewRefsMap.get(this.newCursor(data).toString());
    if (!v) {
      return undefined;
    }
    const i = this.viewContainer.indexOf(v);
    if (i <= 0) {
      return undefined;
    }
    const u = this.viewContainer.get(i - 1);
    if (!u) {
      return undefined;
    }
    return ((u as EmbeddedViewRef<object>).context as any).data;
  }

  public getNextData(data: object): object | undefined {
    const v = this.viewRefsMap.get(this.newCursor(data).toString());
    if (!v) {
      return undefined;
    }
    const i = this.viewContainer.indexOf(v);
    if (i >= this.viewContainer.length) {
      return undefined;
    }
    const u = this.viewContainer.get(i + 1);
    if (!u) {
      return undefined;
    }
    return ((u as EmbeddedViewRef<object>).context as any).data;
  }

}
