

export class Matrix {

    public multiply(A: number[][], B: number[][]): number[][] {
        const m = A.length;
        const l = A[0].length;
        const n = B[0].length;
        const C: number[][] = []
        var i = 0;
        var j = 0;
        var k = 0;

        for (i = 0; i < m; i++) {
            C[i] = [];
            for (j = 0; j < n; j++) {
                var total = 0;

                for (k = 0; k < l; k++) {
                    total += A[i][k] * B[k][j];
                }

                C[i][j] = total;
            }
        }

        return C;
    }

    add(A: number[][], B: number[][]): number[][] {
        return A.map((n, i) => {
            return n.map((o, j) => {
                return o + B[i][j];
            });
        });
    }

    subtract(A: number[][], B: number[][]): number[][] {
        return A.map((n, i) => {
            return n.map((o, j) => {
                return o - B[i][j];
            });
        });
    }
}