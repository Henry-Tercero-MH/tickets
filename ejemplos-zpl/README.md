# Ejemplos de Código ZPL

Esta carpeta contiene ejemplos de código ZPL que puede usar para probar su impresora Zebra GK420t.

## Archivos Incluidos

### 1. etiqueta-ejemplo.zpl
Ejemplo de etiqueta completa con todos los campos y código de barras PDF417.

**Uso:**
- Enviar directamente a la impresora para ver el formato
- Usar como referencia para crear nuevas etiquetas

### 2. etiqueta-prueba.zpl
Etiqueta simple de prueba para verificar que la impresora funciona.

**Uso:**
- Verificar conectividad con la impresora
- Probar calibración

### 3. calibrar-impresora.zpl
Comando ZPL para calibrar la impresora.

**Uso:**
- Enviar cuando la impresora no detecta bien las etiquetas
- Ejecutar después de cambiar el rollo de etiquetas

## Cómo Enviar ZPL a la Impresora

### Opción 1: Desde Zebra Browser Print
1. Abra http://localhost:9100
2. Seleccione su impresora
3. Use la opción "Send ZPL"
4. Pegue el contenido del archivo .zpl
5. Haga clic en "Send"

### Opción 2: Desde la línea de comandos (Windows)
```cmd
type etiqueta-ejemplo.zpl > \\localhost\ZebraGK420t
```

### Opción 3: Desde la línea de comandos (Linux/Mac con impresora en red)
```bash
cat etiqueta-ejemplo.zpl | nc 192.168.1.100 9100
```
(Reemplace 192.168.1.100 con la IP de su impresora)

### Opción 4: Copiar a un puerto (Windows)
```cmd
copy etiqueta-ejemplo.zpl LPT1
```
o
```cmd
copy etiqueta-ejemplo.zpl COM1
```

## Códigos ZPL Útiles Adicionales

### Imprimir configuración de la impresora
```zpl
^XA
^HH
^XZ
```

### Cancelar todos los trabajos
```zpl
~JA
```

### Restablecer impresora
```zpl
^XA
^JUR
^XZ
```

### Verificar estado de la impresora
```zpl
~HQES
```

### Imprimir etiqueta de configuración
```zpl
~WC
```

## Comandos ZPL Básicos

| Comando | Descripción |
|---------|-------------|
| ^XA | Inicio de etiqueta |
| ^XZ | Fin de etiqueta |
| ^PW | Ancho de impresión |
| ^LL | Largo de etiqueta |
| ^FO | Posición de campo (Field Origin) |
| ^A0 | Fuente predeterminada |
| ^FD | Datos del campo (Field Data) |
| ^FS | Fin del campo (Field Separator) |
| ^B7 | Código de barras PDF417 |
| ~SD | Densidad de impresión |
| ^PQ | Cantidad de copias |

## Modificar los Ejemplos

### Cambiar posición de un campo
```zpl
^FOx,y^A0N,altura,ancho^FDTexto^FS
```
- x = posición horizontal (0-400)
- y = posición vertical (0-200)

### Cambiar tamaño de fuente
```zpl
^A0N,altura,ancho
```
- altura = altura de caracteres en dots
- ancho = ancho de caracteres en dots

### Cambiar orientación
```zpl
^FWN  # Normal
^FWR  # 90° rotación
^FWI  # 180° rotación
^FWB  # 270° rotación
```

## Solución de Problemas

### La etiqueta se imprime cortada
- Verifique el tamaño: ^PW400 ^LL200
- Calibre la impresora

### El texto se ve borroso
- Aumente la densidad: ~SD15 (máx. 30)
- Limpie el cabezal de impresión

### El código de barras no escanea
- Verifique que el contenido sea válido
- Aumente el tamaño del código de barras
- Limpie el lector de código de barras

### La impresora no responde
- Verifique la conexión
- Reinicie la impresora
- Envíe el comando de calibración

## Recursos Adicionales

- ZPL Programming Guide: https://www.zebra.com/content/dam/zebra/manuals/printers/common/programming/zpl-zbi2-pm-en.pdf
- ZPL Designer: https://labelary.com/viewer.html (para previsualizar ZPL en línea)

---

**Nota:** Estos archivos ZPL están optimizados para la Zebra GK420t con etiquetas de 5cm × 2.5cm.
