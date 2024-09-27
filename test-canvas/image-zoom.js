zoom(window.document.querySelector('img'))

function zoom(img) {
  let canvas
  if (img.width) {
    load()
  } else {
    img.addEventListener('load', load)
  }

  const originalDisplay = img.style.display
  img.style.display = 'none'

  return () => {
    img.style.display = originalDisplay
    if (canvas) window.document.body.removeChild(canvas)
  }

  function load() {
    let state = {
      move: false,
      height: '100%',
      width: '100%',
      scaleFactor: 1.1,
      scale: 1,
      minScale: 0.05,
      maxScale: 200
    }

    const bcr = img.getBoundingClientRect()
    canvas = window.document.body.appendChild(window.document.createElement('canvas'))
    const ctx = canvas.getContext('2d')
    const scrollTop = window.document.body.scrollTop
    canvas.setAttribute('style', `position:absolute; width:${bcr.width}px; height:${bcr.height}px; z-index:100; top: ${bcr.top + scrollTop}px; left: ${bcr.left}px;`)
    canvas.width = bcr.width
    canvas.height = bcr.height
    const hRatio = canvas.width / img.width
    const vRatio = canvas.height / img.height
    const ratio = Math.min(hRatio, vRatio)
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width * ratio, img.height * ratio)
    trackTransforms(ctx)

    function setState(newState) {
      state = Object.assign({}, state, newState)
      const cursor = state.move ? 'move' : ''
      if (canvas.style.cursor !== cursor) canvas.style.cursor = cursor
    }

    canvas.addEventListener('scroll', onScroll)
    canvas.addEventListener('wheel', onScroll)
    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('mouseup', onUp)
    canvas.addEventListener('mousemove', onMove)

    function zoom(clicks) {
      const pt = ctx.transformedPoint(state.lastX, state.lastY)
      const factor = Math.pow(state.scaleFactor, clicks)
      if (state.scale * factor < state.maxScale && state.scale * factor > state.minScale) {
        ctx.translate(pt.x, pt.y)
        ctx.scale(factor, factor)
        setState({ scale: state.scale * factor })
        ctx.translate(-pt.x, -pt.y)
        redraw()
      }
    }

    function onScroll(e) {
      if (e.ctrlKey) return
      if (isInImage(e)) {
        const delta = 'deltaY' in e ? e.deltaY / 40 : e.detail ? -e.detail : 0
        if (delta) zoom(delta)
        e.preventDefault()
        return false
      }
    }

    function setXY(e) {
      setState({ lastX: e.pageX, lastY: e.pageY })
    }

    function onDown(e) {
      if (!isInImage(e)) return
      setXY(e)
      setState({
        dragStart: ctx.transformedPoint(state.lastX, state.lastY),
        move: true,
        dragged: false
      })
    }

    function onUp(e) {
      setState({ dragStart: null, move: false })
      if (!isInImage(e)) return
      if (!state.dragged) {
        zoom(e.shiftKey ? -1 : 1)
      }
    }

    function onMove(e) {
      if (!isInImage(e)) return
      setXY(e)
      setState({ dragged: true })
      if (state.dragStart) {
        const pt = ctx.transformedPoint(state.lastX, state.lastY)
        ctx.translate(pt.x - state.dragStart.x, pt.y - state.dragStart.y)
        redraw()
      }
    }

    function isInImage(e) {
      setXY(e)
      const data = ctx.getImageData(state.lastX, state.lastY, 1, 1).data
      const rgb = {
        r: data[0],
        g: data[1],
        b: data[2]
      }
      return rgb.r || rgb.g || rgb.b
    }

    function redraw() {
      if (redraw.timer) {
        window.cancelAnimationFrame(redraw.timer)
        redraw.timer = null
      }
      redraw.timer = window.requestAnimationFrame(() => {
        const p1 = ctx.transformedPoint(0, 0)
        const p2 = ctx.transformedPoint(canvas.width, canvas.height)
        ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)
        ctx.save()
        ctx.setTransform(state.scale, 0, 0, state.scale, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.restore()

        const hRatio = canvas.width / img.width
        const vRatio = canvas.height / img.height
        const ratio = Math.min(hRatio, vRatio)
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width * ratio, img.height * ratio)
      })
    }
  }
}

function trackTransforms(ctx) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  let xform = svg.createSVGMatrix()

  const savedTransforms = []

  ctx.getTransform = function () { return xform }
  const save = ctx.save
  ctx.save = function () {
    savedTransforms.push(xform.translate(0, 0))
    return save.call(ctx)
  }

  const restore = ctx.restore
  ctx.restore = function () {
    xform = savedTransforms.pop()
    return restore.call(ctx)
  }

  const scale = ctx.scale
  ctx.scale = function (sx, sy) {
    xform = xform.scaleNonUniform(sx, sy)
    return scale.call(ctx, sx, sy)
  }

  const translate = ctx.translate
  ctx.translate = function (dx, dy) {
    xform = xform.translate(dx, dy)
    return translate.call(ctx, dx, dy)
  }

  const transform = ctx.transform
  ctx.transform = function (a, b, c, d, e, f) {
    const m2 = svg.createSVGMatrix()
    m2.a = a; m2.b = b; m2.c = c; m2.d = d; m2.e = e; m2.f = f
    xform = xform.multiply(m2)
    return transform.call(ctx, a, b, c, d, e, f)
  }

  const setTransform = ctx.setTransform
  ctx.setTransform = function (a, b, c, d, e, f) {
    xform.a = a
    xform.b = b
    xform.c = c
    xform.d = d
    xform.e = e
    xform.f = f
    return setTransform.call(ctx, a, b, c, d, e, f)
  }

  ctx.transformedPoint = function (x, y) {
    const pt = svg.createSVGPoint()
    pt.x = x; pt.y = y
    ctx.transformedPoint.pt = pt
    return pt.matrixTransform(xform.inverse())
  }
}