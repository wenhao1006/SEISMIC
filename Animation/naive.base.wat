(module
  (type (;0;) (func (param f64) (result f64)))
  (type (;1;) (func (param i32 i32 i32)))
  (type (;2;) (func (param f64 f64) (result f64)))
  (type (;3;) (func (param i32 i32 i32 f32)))
  (type (;4;) (func (param f32 f32 f32) (result f32)))
  (type (;5;) (func (param i32 i32 i32 i32)))
  (type (;6;) (func (param i32)))
  (type (;7;) (func (param i32 i32 i32) (result i32)))
  (type (;8;) (func (param i32 i32 f32)))
  (type (;9;) (func (param i32 i32 f32 i32)))
  (type (;10;) (func (param i32 i32 i32 i32 f32 f32 f32)))
  (type (;11;) (func))
  (type (;12;) (func (param i32 i32 i32 f64)))
  (type (;13;) (func (param i32 i32 i32 i32 f64 f64 f64)))
  (type (;14;) (func (param f64 f64 f64) (result f64)))
  (type (;15;) (func (param i32 i32 f64 i32)))
  (type (;16;) (func (param i32 i32 f64)))
  (type (;17;) (func (result i32)))
  (import "env" "memoryBase" (global (;0;) i32))
  (import "env" "_acosf" (func (;0;) (type 0)))
  (import "env" "_alertError" (func (;1;) (type 1)))
  (import "env" "_sinf" (func (;2;) (type 0)))
  (import "env" "_fmodf" (func (;3;) (type 2)))
  (import "env" "memory" (memory (;0;) 256))
  (import "env" "table" (table (;0;) 0 anyfunc))
  (import "env" "tableBase" (global (;1;) i32))
  (func (;4;) (type 3) (param i32 i32 i32 f32)
    (local f32)
    (block  ;; label = @1
      (f32.store
        (get_local 0)
        (f32.add
          (f32.mul
            (tee_local 4
              (f32.sub
                (f32.const 0x1p+0 (;=1;))
                (get_local 3)))
            (f32.load
              (get_local 1)))
          (f32.mul
            (f32.load
              (get_local 2))
            (get_local 3))))
      (f32.store offset=4
        (get_local 0)
        (f32.add
          (f32.mul
            (get_local 4)
            (f32.load offset=4
              (get_local 1)))
          (f32.mul
            (f32.load offset=4
              (get_local 2))
            (get_local 3))))
      (f32.store offset=8
        (get_local 0)
        (f32.add
          (f32.mul
            (get_local 4)
            (f32.load offset=8
              (get_local 1)))
          (f32.mul
            (f32.load offset=8
              (get_local 2))
            (get_local 3))))))
  (func (;5;) (type 4) (param f32 f32 f32) (result f32)
    (f32.add
      (f32.mul
        (get_local 1)
        (get_local 2))
      (f32.mul
        (f32.sub
          (f32.const 0x1p+0 (;=1;))
          (get_local 2))
        (get_local 0))))
  (func (;6;) (type 3) (param i32 i32 i32 f32)
    (local f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32)
    (block  ;; label = @1
      (if  ;; label = @2
        (f32.lt
          (tee_local 4
            (f32.add
              (f32.add
                (f32.add
                  (f32.mul
                    (tee_local 11
                      (f32.load
                        (get_local 1)))
                    (tee_local 6
                      (f32.load
                        (get_local 2))))
                  (f32.mul
                    (tee_local 12
                      (f32.load offset=4
                        (get_local 1)))
                    (tee_local 7
                      (f32.load offset=4
                        (get_local 2)))))
                (f32.mul
                  (tee_local 13
                    (f32.load offset=8
                      (get_local 1)))
                  (tee_local 8
                    (f32.load offset=8
                      (get_local 2)))))
              (f32.mul
                (tee_local 14
                  (f32.load offset=12
                    (get_local 1)))
                (tee_local 9
                  (f32.load offset=12
                    (get_local 2))))))
          (f32.const 0x0p+0 (;=0;)))
        (then
          (set_local 6
            (f32.neg
              (get_local 6)))
          (set_local 4
            (f32.neg
              (get_local 4)))
          (set_local 7
            (f32.neg
              (get_local 7)))
          (set_local 9
            (f32.neg
              (get_local 9)))
          (set_local 8
            (f32.neg
              (get_local 8)))))
      (set_local 5
        (if (result f32)  ;; label = @3
          (f32.gt
            (f32.sub
              (f32.const 0x1p+0 (;=1;))
              (get_local 4))
            (f32.const 0x1.0c6f7ap-20 (;=1e-06;)))
          (then
            (set_local 5
              (f32.demote/f64
                (call 2
                  (f64.promote/f32
                    (tee_local 10
                      (f32.demote/f64
                        (call 0
                          (f64.promote/f32
                            (get_local 4)))))))))
            (set_local 4
              (f32.div
                (f32.demote/f64
                  (call 2
                    (f64.promote/f32
                      (f32.mul
                        (f32.sub
                          (f32.const 0x1p+0 (;=1;))
                          (get_local 3))
                        (get_local 10)))))
                (get_local 5)))
            (f32.div
              (f32.demote/f64
                (call 2
                  (f64.promote/f32
                    (f32.mul
                      (get_local 10)
                      (get_local 3)))))
              (get_local 5)))
          (else
            (set_local 4
              (f32.sub
                (f32.const 0x1p+0 (;=1;))
                (get_local 3)))
            (get_local 3))))
      (f32.store
        (get_local 0)
        (f32.add
          (f32.mul
            (get_local 11)
            (get_local 4))
          (f32.mul
            (get_local 6)
            (get_local 5))))
      (f32.store offset=4
        (get_local 0)
        (f32.add
          (f32.mul
            (get_local 12)
            (get_local 4))
          (f32.mul
            (get_local 7)
            (get_local 5))))
      (f32.store offset=8
        (get_local 0)
        (f32.add
          (f32.mul
            (get_local 13)
            (get_local 4))
          (f32.mul
            (get_local 8)
            (get_local 5))))
      (f32.store offset=12
        (get_local 0)
        (f32.add
          (f32.mul
            (get_local 14)
            (get_local 4))
          (f32.mul
            (get_local 9)
            (get_local 5))))))
  (func (;7;) (type 5) (param i32 i32 i32 i32)
    (local f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32)
    (block  ;; label = @1
      (set_local 11
        (f32.add
          (tee_local 4
            (f32.load
              (get_local 1)))
          (get_local 4)))
      (set_local 12
        (f32.mul
          (get_local 4)
          (tee_local 6
            (f32.add
              (tee_local 5
                (f32.load offset=4
                  (get_local 1)))
              (get_local 5)))))
      (set_local 13
        (f32.mul
          (get_local 4)
          (tee_local 8
            (f32.add
              (tee_local 7
                (f32.load offset=8
                  (get_local 1)))
              (get_local 7)))))
      (set_local 15
        (f32.mul
          (get_local 11)
          (tee_local 14
            (f32.load offset=12
              (get_local 1)))))
      (set_local 9
        (f32.load offset=4
          (get_local 3)))
      (set_local 10
        (f32.load offset=8
          (get_local 3)))
      (f32.store
        (get_local 0)
        (f32.mul
          (tee_local 16
            (f32.load
              (get_local 3)))
          (f32.sub
            (f32.const 0x1p+0 (;=1;))
            (f32.add
              (tee_local 17
                (f32.mul
                  (get_local 5)
                  (get_local 6)))
              (tee_local 7
                (f32.mul
                  (get_local 7)
                  (get_local 8)))))))
      (f32.store offset=4
        (get_local 0)
        (f32.mul
          (get_local 16)
          (f32.add
            (get_local 12)
            (tee_local 18
              (f32.mul
                (get_local 14)
                (get_local 8))))))
      (f32.store offset=8
        (get_local 0)
        (f32.mul
          (get_local 16)
          (f32.sub
            (get_local 13)
            (tee_local 6
              (f32.mul
                (get_local 6)
                (get_local 14))))))
      (f32.store offset=12
        (get_local 0)
        (f32.const 0x0p+0 (;=0;)))
      (f32.store offset=16
        (get_local 0)
        (f32.mul
          (f32.sub
            (get_local 12)
            (get_local 18))
          (get_local 9)))
      (f32.store offset=20
        (get_local 0)
        (f32.mul
          (get_local 9)
          (f32.sub
            (f32.const 0x1p+0 (;=1;))
            (f32.add
              (tee_local 4
                (f32.mul
                  (get_local 4)
                  (get_local 11)))
              (get_local 7)))))
      (f32.store offset=24
        (get_local 0)
        (f32.mul
          (f32.add
            (tee_local 5
              (f32.mul
                (get_local 5)
                (get_local 8)))
            (get_local 15))
          (get_local 9)))
      (f32.store offset=28
        (get_local 0)
        (f32.const 0x0p+0 (;=0;)))
      (f32.store offset=32
        (get_local 0)
        (f32.mul
          (f32.add
            (get_local 13)
            (get_local 6))
          (get_local 10)))
      (f32.store offset=36
        (get_local 0)
        (f32.mul
          (f32.sub
            (get_local 5)
            (get_local 15))
          (get_local 10)))
      (f32.store offset=40
        (get_local 0)
        (f32.mul
          (f32.sub
            (f32.const 0x1p+0 (;=1;))
            (f32.add
              (get_local 4)
              (get_local 17)))
          (get_local 10)))
      (f32.store offset=44
        (get_local 0)
        (f32.const 0x0p+0 (;=0;)))
      (i32.store offset=48
        (get_local 0)
        (i32.load
          (get_local 2)))
      (i32.store offset=52
        (get_local 0)
        (i32.load offset=4
          (get_local 2)))
      (i32.store offset=56
        (get_local 0)
        (i32.load offset=8
          (get_local 2)))
      (f32.store offset=60
        (get_local 0)
        (f32.const 0x1p+0 (;=1;)))))
  (func (;8;) (type 6) (param i32)
    (local i32)
    (block  ;; label = @1
      (f32.store
        (get_local 0)
        (f32.const 0x1p+0 (;=1;)))
      (i32.store
        (tee_local 1
          (i32.add
            (get_local 0)
            (i32.const 4)))
        (i32.const 0))
      (i32.store offset=4
        (get_local 1)
        (i32.const 0))
      (i32.store offset=8
        (get_local 1)
        (i32.const 0))
      (i32.store offset=12
        (get_local 1)
        (i32.const 0))
      (f32.store offset=20
        (get_local 0)
        (f32.const 0x1p+0 (;=1;)))
      (i32.store
        (tee_local 1
          (i32.add
            (get_local 0)
            (i32.const 24)))
        (i32.const 0))
      (i32.store offset=4
        (get_local 1)
        (i32.const 0))
      (i32.store offset=8
        (get_local 1)
        (i32.const 0))
      (i32.store offset=12
        (get_local 1)
        (i32.const 0))
      (f32.store offset=40
        (get_local 0)
        (f32.const 0x1p+0 (;=1;)))
      (i32.store
        (tee_local 1
          (i32.add
            (get_local 0)
            (i32.const 44)))
        (i32.const 0))
      (i32.store offset=4
        (get_local 1)
        (i32.const 0))
      (i32.store offset=8
        (get_local 1)
        (i32.const 0))
      (i32.store offset=12
        (get_local 1)
        (i32.const 0))
      (f32.store offset=60
        (get_local 0)
        (f32.const 0x1p+0 (;=1;)))))
  (func (;9;) (type 1) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 f32)
    (block  ;; label = @1
      (set_local 10
        (i32.add
          (get_local 1)
          (i32.const 16)))
      (set_local 11
        (i32.add
          (get_local 1)
          (i32.const 32)))
      (set_local 12
        (i32.add
          (get_local 1)
          (i32.const 48)))
      (set_local 13
        (i32.add
          (get_local 1)
          (i32.const 4)))
      (set_local 14
        (i32.add
          (get_local 1)
          (i32.const 20)))
      (set_local 15
        (i32.add
          (get_local 1)
          (i32.const 36)))
      (set_local 16
        (i32.add
          (get_local 1)
          (i32.const 52)))
      (set_local 17
        (i32.add
          (get_local 1)
          (i32.const 8)))
      (set_local 18
        (i32.add
          (get_local 1)
          (i32.const 24)))
      (set_local 19
        (i32.add
          (get_local 1)
          (i32.const 40)))
      (set_local 20
        (i32.add
          (get_local 1)
          (i32.const 56)))
      (set_local 21
        (i32.add
          (get_local 1)
          (i32.const 12)))
      (set_local 22
        (i32.add
          (get_local 1)
          (i32.const 28)))
      (set_local 23
        (i32.add
          (get_local 1)
          (i32.const 44)))
      (set_local 24
        (i32.add
          (get_local 1)
          (i32.const 60)))
      (set_local 6
        (i32.const 0))
      (loop  ;; label = @2
        (set_local 5
          (i32.add
            (get_local 2)
            (i32.shl
              (tee_local 4
                (i32.shl
                  (get_local 6)
                  (i32.const 2)))
              (i32.const 2))))
        (f32.store
          (tee_local 3
            (i32.add
              (get_local 0)
              (i32.shl
                (get_local 4)
                (i32.const 2))))
          (f32.const 0x0p+0 (;=0;)))
        (f32.store
          (get_local 3)
          (tee_local 25
            (f32.add
              (f32.mul
                (f32.load
                  (get_local 5))
                (f32.load
                  (get_local 1)))
              (f32.const 0x0p+0 (;=0;)))))
        (f32.store
          (get_local 3)
          (tee_local 25
            (f32.add
              (get_local 25)
              (f32.mul
                (f32.load
                  (tee_local 7
                    (i32.add
                      (get_local 2)
                      (i32.shl
                        (i32.or
                          (get_local 4)
                          (i32.const 1))
                        (i32.const 2)))))
                (f32.load
                  (get_local 10))))))
        (f32.store
          (get_local 3)
          (tee_local 25
            (f32.add
              (get_local 25)
              (f32.mul
                (f32.load
                  (tee_local 8
                    (i32.add
                      (get_local 2)
                      (i32.shl
                        (i32.or
                          (get_local 4)
                          (i32.const 2))
                        (i32.const 2)))))
                (f32.load
                  (get_local 11))))))
        (f32.store
          (get_local 3)
          (f32.add
            (get_local 25)
            (f32.mul
              (f32.load
                (tee_local 9
                  (i32.add
                    (get_local 2)
                    (i32.shl
                      (i32.or
                        (get_local 4)
                        (i32.const 3))
                      (i32.const 2)))))
              (f32.load
                (get_local 12)))))
        (f32.store
          (tee_local 3
            (i32.add
              (get_local 0)
              (i32.shl
                (i32.or
                  (get_local 4)
                  (i32.const 1))
                (i32.const 2))))
          (f32.const 0x0p+0 (;=0;)))
        (f32.store
          (get_local 3)
          (tee_local 25
            (f32.add
              (f32.mul
                (f32.load
                  (get_local 5))
                (f32.load
                  (get_local 13)))
              (f32.const 0x0p+0 (;=0;)))))
        (f32.store
          (get_local 3)
          (tee_local 25
            (f32.add
              (get_local 25)
              (f32.mul
                (f32.load
                  (get_local 7))
                (f32.load
                  (get_local 14))))))
        (f32.store
          (get_local 3)
          (tee_local 25
            (f32.add
              (get_local 25)
              (f32.mul
                (f32.load
                  (get_local 8))
                (f32.load
                  (get_local 15))))))
        (f32.store
          (get_local 3)
          (f32.add
            (get_local 25)
            (f32.mul
              (f32.load
                (get_local 9))
              (f32.load
                (get_local 16)))))
        (f32.store
          (tee_local 3
            (i32.add
              (get_local 0)
              (i32.shl
                (i32.or
                  (get_local 4)
                  (i32.const 2))
                (i32.const 2))))
          (f32.const 0x0p+0 (;=0;)))
        (f32.store
          (get_local 3)
          (tee_local 25
            (f32.add
              (f32.mul
                (f32.load
                  (get_local 5))
                (f32.load
                  (get_local 17)))
              (f32.const 0x0p+0 (;=0;)))))
        (f32.store
          (get_local 3)
          (tee_local 25
            (f32.add
              (get_local 25)
              (f32.mul
                (f32.load
                  (get_local 7))
                (f32.load
                  (get_local 18))))))
        (f32.store
          (get_local 3)
          (tee_local 25
            (f32.add
              (get_local 25)
              (f32.mul
                (f32.load
                  (get_local 8))
                (f32.load
                  (get_local 19))))))
        (f32.store
          (get_local 3)
          (f32.add
            (get_local 25)
            (f32.mul
              (f32.load
                (get_local 9))
              (f32.load
                (get_local 20)))))
        (f32.store
          (tee_local 4
            (i32.add
              (get_local 0)
              (i32.shl
                (i32.or
                  (get_local 4)
                  (i32.const 3))
                (i32.const 2))))
          (f32.const 0x0p+0 (;=0;)))
        (f32.store
          (get_local 4)
          (tee_local 25
            (f32.add
              (f32.mul
                (f32.load
                  (get_local 5))
                (f32.load
                  (get_local 21)))
              (f32.const 0x0p+0 (;=0;)))))
        (f32.store
          (get_local 4)
          (tee_local 25
            (f32.add
              (get_local 25)
              (f32.mul
                (f32.load
                  (get_local 7))
                (f32.load
                  (get_local 22))))))
        (f32.store
          (get_local 4)
          (tee_local 25
            (f32.add
              (get_local 25)
              (f32.mul
                (f32.load
                  (get_local 8))
                (f32.load
                  (get_local 23))))))
        (f32.store
          (get_local 4)
          (f32.add
            (get_local 25)
            (f32.mul
              (f32.load
                (get_local 9))
              (f32.load
                (get_local 24)))))
        (br_if 0 (;@2;)
          (i32.ne
            (tee_local 6
              (i32.add
                (get_local 6)
                (i32.const 1)))
            (i32.const 4))))))
  (func (;10;) (type 7) (param i32 i32 i32) (result i32)
    (local i32 i32 i32)
    (block (result i32)  ;; label = @1
      (if  ;; label = @2
        (i32.eqz
          (tee_local 4
            (i32.load offset=4
              (get_local 1))))
        (then
          (return
            (i32.const 0))))
      (set_local 5
        (i32.load offset=8
          (get_local 1)))
      (set_local 1
        (i32.const 0))
      (block  ;; label = @3
        (block  ;; label = @4
          (loop  ;; label = @5
            (if  ;; label = @6
              (i32.ne
                (i32.load
                  (tee_local 3
                    (i32.add
                      (get_local 5)
                      (i32.mul
                        (get_local 1)
                        (i32.const 72)))))
                (get_local 2))
              (then
                (if  ;; label = @7
                  (i32.lt_u
                    (tee_local 1
                      (i32.add
                        (get_local 1)
                        (i32.const 1)))
                    (get_local 4))
                  (then
                    (br 2 (;@5;)))
                  (else
                    (set_local 0
                      (i32.const 0))
                    (br 3 (;@4;))))
                (unreachable))))
          (br 1 (;@6;)))
        (return
          (get_local 0)))
      (set_local 1
        (i32.add
          (get_local 0)
          (i32.const 72)))
      (loop  ;; label = @8
        (i32.store
          (get_local 0)
          (i32.load
            (get_local 3)))
        (set_local 3
          (i32.add
            (get_local 3)
            (i32.const 4)))
        (br_if 0 (;@8;)
          (i32.lt_s
            (tee_local 0
              (i32.add
                (get_local 0)
                (i32.const 4)))
            (get_local 1))))
      (i32.const 1)))
  (func (;11;) (type 7) (param i32 i32 i32) (result i32)
    (local i32 i32 i32)
    (block (result i32)  ;; label = @1
      (if  ;; label = @2
        (i32.eqz
          (tee_local 4
            (i32.load offset=12
              (get_local 1))))
        (then
          (return
            (i32.const 0))))
      (set_local 5
        (i32.load offset=16
          (get_local 1)))
      (set_local 1
        (i32.const 0))
      (block  ;; label = @3
        (block  ;; label = @4
          (loop  ;; label = @5
            (if  ;; label = @6
              (i32.ne
                (i32.load
                  (tee_local 3
                    (i32.add
                      (get_local 5)
                      (i32.mul
                        (get_local 1)
                        (i32.const 28)))))
                (get_local 2))
              (then
                (if  ;; label = @7
                  (i32.lt_u
                    (tee_local 1
                      (i32.add
                        (get_local 1)
                        (i32.const 1)))
                    (get_local 4))
                  (then
                    (br 2 (;@5;)))
                  (else
                    (set_local 0
                      (i32.const 0))
                    (br 3 (;@4;))))
                (unreachable))))
          (br 1 (;@6;)))
        (return
          (get_local 0)))
      (i32.store
        (get_local 0)
        (i32.load
          (get_local 3)))
      (i32.store offset=4
        (get_local 0)
        (i32.load offset=4
          (get_local 3)))
      (i32.store offset=8
        (get_local 0)
        (i32.load offset=8
          (get_local 3)))
      (i32.store offset=12
        (get_local 0)
        (i32.load offset=12
          (get_local 3)))
      (i32.store offset=16
        (get_local 0)
        (i32.load offset=16
          (get_local 3)))
      (i32.store offset=20
        (get_local 0)
        (i32.load offset=20
          (get_local 3)))
      (i32.store offset=24
        (get_local 0)
        (i32.load offset=24
          (get_local 3)))
      (i32.const 1)))
  (func (;12;) (type 8) (param i32 i32 f32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32)
    (block  ;; label = @1
      (if  ;; label = @2
        (i32.eqz
          (tee_local 6
            (i32.load offset=8
              (get_local 1))))
        (then
          (call 1
            (i32.const 0)
            (i32.const 29)
            (i32.const 0))
          (return)))
      (if  ;; label = @3
        (i32.eqz
          (tee_local 5
            (i32.load offset=16
              (get_local 1))))
        (then
          (call 1
            (i32.const 0)
            (i32.const 30)
            (i32.const 0))
          (return)))
      (if  ;; label = @4
        (i32.eqz
          (tee_local 7
            (i32.load offset=24
              (get_local 1))))
        (then
          (call 1
            (i32.const 0)
            (i32.const 31)
            (i32.const 0))
          (return)))
      (set_local 6
        (if (result i32)  ;; label = @5
          (i32.eq
            (tee_local 3
              (i32.load offset=4
                (get_local 1)))
            (i32.const 1))
          (then
            (set_local 10
              (i32.load offset=4
                (get_local 6)))
            (set_local 11
              (i32.load offset=8
                (get_local 6)))
            (i32.load offset=12
              (get_local 6)))
          (else
            (set_local 13
              (f32.demote/f64
                (call 3
                  (f64.promote/f32
                    (get_local 2))
                  (f64.promote/f32
                    (tee_local 12
                      (f32.load
                        (i32.add
                          (get_local 6)
                          (i32.shl
                            (tee_local 3
                              (i32.add
                                (get_local 3)
                                (i32.const -1)))
                            (i32.const 4)))))))))
            (set_local 12
              (f32.add
                (get_local 12)
                (get_local 13)))
            (if  ;; label = @6
              (f32.lt
                (get_local 13)
                (f32.const 0x0p+0 (;=0;)))
              (then
                (set_local 13
                  (get_local 12))))
            (block  ;; label = @7
              (if  ;; label = @8
                (get_local 3)
                (then
                  (set_local 9
                    (i32.const 0))
                  (loop  ;; label = @9
                    (loop  ;; label = @10
                      (if  ;; label = @11
                        (i32.eqz
                          (f32.le
                            (tee_local 12
                              (f32.load
                                (i32.add
                                  (get_local 6)
                                  (i32.shl
                                    (tee_local 8
                                      (i32.add
                                        (tee_local 4
                                          (i32.shr_u
                                            (i32.add
                                              (get_local 3)
                                              (get_local 9))
                                            (i32.const 1)))
                                        (i32.const 1)))
                                    (i32.const 4)))))
                            (get_local 13)))
                        (then
                          (br_if 4 (;@7;)
                            (i32.eqz
                              (f32.ge
                                (f32.load
                                  (i32.add
                                    (get_local 6)
                                    (i32.shl
                                      (get_local 4)
                                      (i32.const 4))))
                                (get_local 13))))
                          (br_if 1 (;@10;)
                            (i32.lt_u
                              (get_local 9)
                              (tee_local 3
                                (i32.add
                                  (get_local 4)
                                  (i32.const -1)))))
                          (br 4 (;@7;)))))
                    (if  ;; label = @12
                      (i32.lt_u
                        (get_local 8)
                        (get_local 3))
                      (then
                        (set_local 9
                          (get_local 8))
                        (br 1 (;@11;))))))
                (else
                  (set_local 4
                    (i32.const 0))
                  (set_local 12
                    (f32.load offset=16
                      (get_local 6))))))
            (set_local 12
              (f32.sub
                (f32.const 0x1p+0 (;=1;))
                (tee_local 13
                  (f32.div
                    (f32.sub
                      (get_local 13)
                      (tee_local 13
                        (f32.load
                          (i32.add
                            (get_local 6)
                            (i32.shl
                              (get_local 4)
                              (i32.const 4))))))
                    (f32.sub
                      (get_local 12)
                      (get_local 13))))))
            (set_local 10
              (i32.reinterpret/f32
                (f32.add
                  (f32.mul
                    (f32.load offset=4
                      (i32.add
                        (get_local 6)
                        (i32.shl
                          (tee_local 3
                            (i32.add
                              (get_local 4)
                              (i32.const 1)))
                          (i32.const 4))))
                    (get_local 13))
                  (f32.mul
                    (f32.load offset=4
                      (i32.add
                        (get_local 6)
                        (i32.shl
                          (get_local 4)
                          (i32.const 4))))
                    (get_local 12)))))
            (set_local 11
              (i32.reinterpret/f32
                (f32.add
                  (f32.mul
                    (get_local 12)
                    (f32.load offset=8
                      (i32.add
                        (get_local 6)
                        (i32.shl
                          (get_local 4)
                          (i32.const 4)))))
                  (f32.mul
                    (get_local 13)
                    (f32.load offset=8
                      (i32.add
                        (get_local 6)
                        (i32.shl
                          (get_local 3)
                          (i32.const 4))))))))
            (i32.reinterpret/f32
              (f32.add
                (f32.mul
                  (get_local 12)
                  (f32.load offset=12
                    (i32.add
                      (get_local 6)
                      (i32.shl
                        (get_local 4)
                        (i32.const 4)))))
                (f32.mul
                  (get_local 13)
                  (f32.load offset=12
                    (i32.add
                      (get_local 6)
                      (i32.shl
                        (get_local 3)
                        (i32.const 4))))))))))
      (set_local 23
        (if (result f32)  ;; label = @13
          (i32.eq
            (tee_local 3
              (i32.load offset=12
                (get_local 1)))
            (i32.const 1))
          (then
            (set_local 18
              (f32.load offset=4
                (get_local 5)))
            (set_local 20
              (f32.load offset=8
                (get_local 5)))
            (set_local 17
              (f32.load offset=12
                (get_local 5)))
            (f32.load offset=16
              (get_local 5)))
          (else
            (set_local 13
              (f32.demote/f64
                (call 3
                  (f64.promote/f32
                    (get_local 2))
                  (f64.promote/f32
                    (tee_local 12
                      (f32.load
                        (i32.add
                          (get_local 5)
                          (i32.mul
                            (tee_local 3
                              (i32.add
                                (get_local 3)
                                (i32.const -1)))
                            (i32.const 20)))))))))
            (set_local 12
              (f32.add
                (get_local 12)
                (get_local 13)))
            (set_local 15
              (if (result f32)  ;; label = @14
                (f32.lt
                  (get_local 13)
                  (f32.const 0x0p+0 (;=0;)))
                (then
                  (get_local 12))
                (else
                  (get_local 13))))
            (block  ;; label = @15
              (if  ;; label = @16
                (get_local 3)
                (then
                  (set_local 9
                    (i32.const 0))
                  (loop  ;; label = @17
                    (loop  ;; label = @18
                      (if  ;; label = @19
                        (i32.eqz
                          (f32.le
                            (tee_local 12
                              (f32.load
                                (i32.add
                                  (get_local 5)
                                  (i32.mul
                                    (tee_local 8
                                      (i32.add
                                        (tee_local 4
                                          (i32.shr_u
                                            (i32.add
                                              (get_local 3)
                                              (get_local 9))
                                            (i32.const 1)))
                                        (i32.const 1)))
                                    (i32.const 20)))))
                            (get_local 15)))
                        (then
                          (br_if 4 (;@15;)
                            (i32.eqz
                              (f32.ge
                                (f32.load
                                  (i32.add
                                    (get_local 5)
                                    (i32.mul
                                      (get_local 4)
                                      (i32.const 20))))
                                (get_local 15))))
                          (br_if 1 (;@18;)
                            (i32.lt_u
                              (get_local 9)
                              (tee_local 3
                                (i32.add
                                  (get_local 4)
                                  (i32.const -1)))))
                          (br 4 (;@15;)))))
                    (if  ;; label = @20
                      (i32.lt_u
                        (get_local 8)
                        (get_local 3))
                      (then
                        (set_local 9
                          (get_local 8))
                        (br 1 (;@19;))))))
                (else
                  (set_local 4
                    (i32.const 0))
                  (set_local 12
                    (f32.load offset=20
                      (get_local 5))))))
            (set_local 24
              (f32.load
                (i32.add
                  (get_local 5)
                  (i32.mul
                    (get_local 4)
                    (i32.const 20)))))
            (set_local 13
              (if (result f32)  ;; label = @21
                (f32.lt
                  (tee_local 13
                    (f32.add
                      (f32.add
                        (f32.add
                          (f32.mul
                            (tee_local 18
                              (f32.load offset=4
                                (i32.add
                                  (get_local 5)
                                  (i32.mul
                                    (get_local 4)
                                    (i32.const 20)))))
                            (tee_local 21
                              (f32.load offset=4
                                (i32.add
                                  (get_local 5)
                                  (i32.mul
                                    (tee_local 3
                                      (i32.add
                                        (get_local 4)
                                        (i32.const 1)))
                                    (i32.const 20))))))
                          (f32.mul
                            (tee_local 20
                              (f32.load offset=8
                                (i32.add
                                  (get_local 5)
                                  (i32.mul
                                    (get_local 4)
                                    (i32.const 20)))))
                            (tee_local 17
                              (f32.load offset=8
                                (i32.add
                                  (get_local 5)
                                  (i32.mul
                                    (get_local 3)
                                    (i32.const 20)))))))
                        (f32.mul
                          (tee_local 23
                            (f32.load offset=12
                              (i32.add
                                (get_local 5)
                                (i32.mul
                                  (get_local 4)
                                  (i32.const 20)))))
                          (tee_local 16
                            (f32.load offset=12
                              (i32.add
                                (get_local 5)
                                (i32.mul
                                  (get_local 3)
                                  (i32.const 20)))))))
                      (f32.mul
                        (tee_local 22
                          (f32.load offset=16
                            (i32.add
                              (get_local 5)
                              (i32.mul
                                (get_local 4)
                                (i32.const 20)))))
                        (tee_local 19
                          (f32.load offset=16
                            (i32.add
                              (get_local 5)
                              (i32.mul
                                (get_local 3)
                                (i32.const 20))))))))
                  (f32.const 0x0p+0 (;=0;)))
                (then
                  (set_local 21
                    (f32.neg
                      (get_local 21)))
                  (set_local 14
                    (f32.neg
                      (get_local 13)))
                  (set_local 17
                    (f32.neg
                      (get_local 17)))
                  (set_local 19
                    (f32.neg
                      (get_local 19)))
                  (f32.neg
                    (get_local 16)))
                (else
                  (set_local 14
                    (get_local 13))
                  (get_local 16))))
            (set_local 16
              (f32.div
                (f32.sub
                  (get_local 15)
                  (get_local 24))
                (f32.sub
                  (get_local 12)
                  (get_local 24))))
            (set_local 14
              (if (result f32)  ;; label = @22
                (f32.gt
                  (f32.sub
                    (f32.const 0x1p+0 (;=1;))
                    (get_local 14))
                  (f32.const 0x1.0c6f7ap-20 (;=1e-06;)))
                (then
                  (set_local 14
                    (f32.demote/f64
                      (call 2
                        (f64.promote/f32
                          (tee_local 15
                            (f32.demote/f64
                              (call 0
                                (f64.promote/f32
                                  (get_local 14)))))))))
                  (set_local 12
                    (f32.div
                      (f32.demote/f64
                        (call 2
                          (f64.promote/f32
                            (f32.mul
                              (f32.sub
                                (f32.const 0x1p+0 (;=1;))
                                (get_local 16))
                              (get_local 15)))))
                      (get_local 14)))
                  (f32.div
                    (f32.demote/f64
                      (call 2
                        (f64.promote/f32
                          (f32.mul
                            (get_local 16)
                            (get_local 15)))))
                    (get_local 14)))
                (else
                  (set_local 12
                    (f32.sub
                      (f32.const 0x1p+0 (;=1;))
                      (get_local 16)))
                  (get_local 16))))
            (set_local 18
              (f32.add
                (f32.mul
                  (get_local 18)
                  (get_local 12))
                (f32.mul
                  (get_local 21)
                  (get_local 14))))
            (set_local 20
              (f32.add
                (f32.mul
                  (get_local 20)
                  (get_local 12))
                (f32.mul
                  (get_local 17)
                  (get_local 14))))
            (set_local 17
              (f32.add
                (f32.mul
                  (get_local 23)
                  (get_local 12))
                (f32.mul
                  (get_local 13)
                  (get_local 14))))
            (f32.add
              (f32.mul
                (get_local 22)
                (get_local 12))
              (f32.mul
                (get_local 19)
                (get_local 14))))))
      (set_local 14
        (if (result f32)  ;; label = @23
          (i32.eq
            (tee_local 1
              (i32.load offset=20
                (get_local 1)))
            (i32.const 1))
          (then
            (set_local 22
              (f32.load offset=4
                (get_local 7)))
            (set_local 15
              (f32.load offset=8
                (get_local 7)))
            (f32.load offset=12
              (get_local 7)))
          (else
            (set_local 12
              (f32.demote/f64
                (call 3
                  (f64.promote/f32
                    (get_local 2))
                  (f64.promote/f32
                    (tee_local 2
                      (f32.load
                        (i32.add
                          (get_local 7)
                          (i32.shl
                            (tee_local 1
                              (i32.add
                                (get_local 1)
                                (i32.const -1)))
                            (i32.const 4)))))))))
            (set_local 2
              (f32.add
                (get_local 2)
                (get_local 12)))
            (if  ;; label = @24
              (f32.lt
                (get_local 12)
                (f32.const 0x0p+0 (;=0;)))
              (then
                (set_local 12
                  (get_local 2))))
            (block  ;; label = @25
              (if  ;; label = @26
                (get_local 1)
                (then
                  (set_local 8
                    (i32.const 0))
                  (loop  ;; label = @27
                    (loop  ;; label = @28
                      (if  ;; label = @29
                        (i32.eqz
                          (f32.le
                            (tee_local 2
                              (f32.load
                                (i32.add
                                  (get_local 7)
                                  (i32.shl
                                    (tee_local 4
                                      (i32.add
                                        (tee_local 3
                                          (i32.shr_u
                                            (i32.add
                                              (get_local 1)
                                              (get_local 8))
                                            (i32.const 1)))
                                        (i32.const 1)))
                                    (i32.const 4)))))
                            (get_local 12)))
                        (then
                          (br_if 4 (;@25;)
                            (i32.eqz
                              (f32.ge
                                (f32.load
                                  (i32.add
                                    (get_local 7)
                                    (i32.shl
                                      (get_local 3)
                                      (i32.const 4))))
                                (get_local 12))))
                          (br_if 1 (;@28;)
                            (i32.lt_u
                              (get_local 8)
                              (tee_local 1
                                (i32.add
                                  (get_local 3)
                                  (i32.const -1)))))
                          (br 4 (;@25;)))))
                    (if  ;; label = @30
                      (i32.lt_u
                        (get_local 4)
                        (get_local 1))
                      (then
                        (set_local 8
                          (get_local 4))
                        (br 1 (;@29;))))))
                (else
                  (set_local 3
                    (i32.const 0))
                  (set_local 2
                    (f32.load offset=16
                      (get_local 7))))))
            (set_local 2
              (f32.sub
                (f32.const 0x1p+0 (;=1;))
                (tee_local 12
                  (f32.div
                    (f32.sub
                      (get_local 12)
                      (tee_local 12
                        (f32.load
                          (i32.add
                            (get_local 7)
                            (i32.shl
                              (get_local 3)
                              (i32.const 4))))))
                    (f32.sub
                      (get_local 2)
                      (get_local 12))))))
            (set_local 22
              (f32.add
                (f32.mul
                  (f32.load offset=4
                    (i32.add
                      (get_local 7)
                      (i32.shl
                        (tee_local 1
                          (i32.add
                            (get_local 3)
                            (i32.const 1)))
                        (i32.const 4))))
                  (get_local 12))
                (f32.mul
                  (f32.load offset=4
                    (i32.add
                      (get_local 7)
                      (i32.shl
                        (get_local 3)
                        (i32.const 4))))
                  (get_local 2))))
            (set_local 15
              (f32.add
                (f32.mul
                  (get_local 2)
                  (f32.load offset=8
                    (i32.add
                      (get_local 7)
                      (i32.shl
                        (get_local 3)
                        (i32.const 4)))))
                (f32.mul
                  (get_local 12)
                  (f32.load offset=8
                    (i32.add
                      (get_local 7)
                      (i32.shl
                        (get_local 1)
                        (i32.const 4)))))))
            (f32.add
              (f32.mul
                (get_local 2)
                (f32.load offset=12
                  (i32.add
                    (get_local 7)
                    (i32.shl
                      (get_local 3)
                      (i32.const 4)))))
              (f32.mul
                (get_local 12)
                (f32.load offset=12
                  (i32.add
                    (get_local 7)
                    (i32.shl
                      (get_local 1)
                      (i32.const 4)))))))))
      (set_local 13
        (f32.mul
          (get_local 18)
          (tee_local 19
            (f32.add
              (get_local 20)
              (get_local 20)))))
      (set_local 21
        (f32.mul
          (tee_local 16
            (f32.add
              (get_local 17)
              (get_local 17)))
          (get_local 18)))
      (f32.store
        (get_local 0)
        (f32.mul
          (f32.sub
            (f32.const 0x1p+0 (;=1;))
            (f32.add
              (tee_local 12
                (f32.mul
                  (get_local 17)
                  (get_local 16)))
              (tee_local 17
                (f32.mul
                  (get_local 20)
                  (get_local 19)))))
          (get_local 22)))
      (f32.store offset=4
        (get_local 0)
        (f32.mul
          (f32.add
            (tee_local 2
              (f32.mul
                (get_local 23)
                (get_local 16)))
            (get_local 13))
          (get_local 22)))
      (f32.store offset=8
        (get_local 0)
        (f32.mul
          (f32.sub
            (get_local 21)
            (tee_local 19
              (f32.mul
                (get_local 23)
                (get_local 19))))
          (get_local 22)))
      (f32.store offset=12
        (get_local 0)
        (f32.const 0x0p+0 (;=0;)))
      (f32.store offset=16
        (get_local 0)
        (f32.mul
          (f32.sub
            (get_local 13)
            (get_local 2))
          (get_local 15)))
      (f32.store offset=20
        (get_local 0)
        (f32.mul
          (f32.sub
            (f32.const 0x1p+0 (;=1;))
            (f32.add
              (get_local 12)
              (tee_local 13
                (f32.mul
                  (get_local 18)
                  (tee_local 2
                    (f32.add
                      (get_local 18)
                      (get_local 18)))))))
          (get_local 15)))
      (f32.store offset=24
        (get_local 0)
        (f32.mul
          (f32.add
            (tee_local 12
              (f32.mul
                (get_local 20)
                (get_local 16)))
            (tee_local 2
              (f32.mul
                (get_local 23)
                (get_local 2))))
          (get_local 15)))
      (f32.store offset=28
        (get_local 0)
        (f32.const 0x0p+0 (;=0;)))
      (f32.store offset=32
        (get_local 0)
        (f32.mul
          (f32.add
            (get_local 21)
            (get_local 19))
          (get_local 14)))
      (f32.store offset=36
        (get_local 0)
        (f32.mul
          (f32.sub
            (get_local 12)
            (get_local 2))
          (get_local 14)))
      (f32.store offset=40
        (get_local 0)
        (f32.mul
          (f32.sub
            (f32.const 0x1p+0 (;=1;))
            (f32.add
              (get_local 17)
              (get_local 13)))
          (get_local 14)))
      (f32.store offset=44
        (get_local 0)
        (f32.const 0x0p+0 (;=0;)))
      (i32.store offset=48
        (get_local 0)
        (get_local 10))
      (i32.store offset=52
        (get_local 0)
        (get_local 11))
      (i32.store offset=56
        (get_local 0)
        (get_local 6))
      (f32.store offset=60
        (get_local 0)
        (f32.const 0x1p+0 (;=1;)))))
  (func (;13;) (type 9) (param i32 i32 f32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32)
    (block  ;; label = @1
      (set_local 8
        (get_global 2))
      (set_global 2
        (i32.add
          (get_global 2)
          (i32.const 240)))
      (if  ;; label = @2
        (i32.eqz
          (get_local 3))
        (then
          (f32.store
            (get_local 0)
            (f32.const 0x1p+0 (;=1;)))
          (i32.store
            (tee_local 1
              (i32.add
                (get_local 0)
                (i32.const 4)))
            (i32.const 0))
          (i32.store offset=4
            (get_local 1)
            (i32.const 0))
          (i32.store offset=8
            (get_local 1)
            (i32.const 0))
          (i32.store offset=12
            (get_local 1)
            (i32.const 0))
          (f32.store offset=20
            (get_local 0)
            (f32.const 0x1p+0 (;=1;)))
          (i32.store
            (tee_local 1
              (i32.add
                (get_local 0)
                (i32.const 24)))
            (i32.const 0))
          (i32.store offset=4
            (get_local 1)
            (i32.const 0))
          (i32.store offset=8
            (get_local 1)
            (i32.const 0))
          (i32.store offset=12
            (get_local 1)
            (i32.const 0))
          (f32.store offset=40
            (get_local 0)
            (f32.const 0x1p+0 (;=1;)))
          (i32.store
            (tee_local 1
              (i32.add
                (get_local 0)
                (i32.const 44)))
            (i32.const 0))
          (i32.store offset=4
            (get_local 1)
            (i32.const 0))
          (i32.store offset=8
            (get_local 1)
            (i32.const 0))
          (i32.store offset=12
            (get_local 1)
            (i32.const 0))
          (f32.store offset=60
            (get_local 0)
            (f32.const 0x1p+0 (;=1;)))
          (set_global 2
            (get_local 8))
          (return)))
      (set_local 9
        (i32.add
          (get_local 8)
          (i32.const 160)))
      (set_local 4
        (i32.add
          (get_local 8)
          (i32.const 96)))
      (set_local 7
        (i32.add
          (get_local 8)
          (i32.const 64)))
      (set_local 10
        (get_local 8))
      (block  ;; label = @3
        (block  ;; label = @4
          (br_if 0 (;@4;)
            (i32.eqz
              (tee_local 12
                (i32.load offset=4
                  (get_local 1)))))
          (set_local 5
            (i32.load offset=8
              (get_local 1)))
          (set_local 6
            (i32.const 0))
          (loop  ;; label = @5
            (if  ;; label = @6
              (i32.ne
                (i32.load
                  (tee_local 11
                    (i32.add
                      (get_local 5)
                      (i32.mul
                        (get_local 6)
                        (i32.const 72)))))
                (get_local 3))
              (then
                (br_if 2 (;@4;)
                  (i32.ge_u
                    (tee_local 6
                      (i32.add
                        (get_local 6)
                        (i32.const 1)))
                    (get_local 12)))
                (br 1 (;@5;)))))
          (set_local 5
            (i32.add
              (tee_local 6
                (get_local 9))
              (i32.const 72)))
          (loop  ;; label = @7
            (i32.store
              (get_local 6)
              (i32.load
                (get_local 11)))
            (set_local 11
              (i32.add
                (get_local 11)
                (i32.const 4)))
            (br_if 0 (;@7;)
              (i32.lt_s
                (tee_local 6
                  (i32.add
                    (get_local 6)
                    (i32.const 4)))
                (get_local 5))))
          (call 13
            (get_local 4)
            (get_local 1)
            (get_local 2)
            (i32.load offset=4
              (get_local 9)))
          (block  ;; label = @8
            (block  ;; label = @9
              (br_if 0 (;@9;)
                (i32.eqz
                  (tee_local 11
                    (i32.load offset=12
                      (get_local 1)))))
              (set_local 6
                (i32.load offset=16
                  (get_local 1)))
              (set_local 1
                (i32.const 0))
              (loop  ;; label = @10
                (if  ;; label = @11
                  (i32.ne
                    (i32.load
                      (tee_local 5
                        (i32.add
                          (get_local 6)
                          (i32.mul
                            (get_local 1)
                            (i32.const 28)))))
                    (get_local 3))
                  (then
                    (br_if 2 (;@9;)
                      (i32.ge_u
                        (tee_local 1
                          (i32.add
                            (get_local 1)
                            (i32.const 1)))
                        (get_local 11)))
                    (br 1 (;@10;)))))
              (i32.store
                (get_local 7)
                (i32.load
                  (get_local 5)))
              (i32.store offset=4
                (get_local 7)
                (i32.load offset=4
                  (get_local 5)))
              (i32.store offset=8
                (get_local 7)
                (i32.load offset=8
                  (get_local 5)))
              (i32.store offset=12
                (get_local 7)
                (i32.load offset=12
                  (get_local 5)))
              (i32.store offset=16
                (get_local 7)
                (i32.load offset=16
                  (get_local 5)))
              (i32.store offset=20
                (get_local 7)
                (i32.load offset=20
                  (get_local 5)))
              (i32.store offset=24
                (get_local 7)
                (i32.load offset=24
                  (get_local 5)))
              (call 12
                (get_local 10)
                (get_local 7)
                (get_local 2))
              (set_local 17
                (f32.load
                  (get_local 4)))
              (set_local 18
                (f32.load offset=16
                  (get_local 4)))
              (set_local 19
                (f32.load offset=32
                  (get_local 4)))
              (set_local 20
                (f32.load offset=48
                  (get_local 4)))
              (set_local 21
                (f32.load offset=4
                  (get_local 4)))
              (set_local 22
                (f32.load offset=20
                  (get_local 4)))
              (set_local 23
                (f32.load offset=36
                  (get_local 4)))
              (set_local 24
                (f32.load offset=52
                  (get_local 4)))
              (set_local 25
                (f32.load offset=8
                  (get_local 4)))
              (set_local 26
                (f32.load offset=24
                  (get_local 4)))
              (set_local 27
                (f32.load offset=40
                  (get_local 4)))
              (set_local 28
                (f32.load offset=56
                  (get_local 4)))
              (set_local 29
                (f32.load offset=12
                  (get_local 4)))
              (set_local 30
                (f32.load offset=28
                  (get_local 4)))
              (set_local 31
                (f32.load offset=44
                  (get_local 4)))
              (set_local 2
                (f32.load offset=60
                  (get_local 4)))
              (set_local 1
                (i32.const 0))
              (loop  ;; label = @12
                (set_local 13
                  (f32.load
                    (i32.add
                      (get_local 10)
                      (i32.shl
                        (tee_local 3
                          (i32.shl
                            (get_local 1)
                            (i32.const 2)))
                        (i32.const 2)))))
                (f32.store
                  (i32.add
                    (get_local 0)
                    (i32.shl
                      (get_local 3)
                      (i32.const 2)))
                  (f32.add
                    (f32.add
                      (f32.add
                        (f32.add
                          (f32.mul
                            (get_local 13)
                            (get_local 17))
                          (f32.const 0x0p+0 (;=0;)))
                        (f32.mul
                          (tee_local 14
                            (f32.load
                              (i32.add
                                (get_local 10)
                                (i32.shl
                                  (i32.or
                                    (get_local 3)
                                    (i32.const 1))
                                  (i32.const 2)))))
                          (get_local 18)))
                      (f32.mul
                        (tee_local 15
                          (f32.load
                            (i32.add
                              (get_local 10)
                              (i32.shl
                                (i32.or
                                  (get_local 3)
                                  (i32.const 2))
                                (i32.const 2)))))
                        (get_local 19)))
                    (f32.mul
                      (tee_local 16
                        (f32.load
                          (i32.add
                            (get_local 10)
                            (i32.shl
                              (i32.or
                                (get_local 3)
                                (i32.const 3))
                              (i32.const 2)))))
                      (get_local 20))))
                (f32.store
                  (i32.add
                    (get_local 0)
                    (i32.shl
                      (i32.or
                        (get_local 3)
                        (i32.const 1))
                      (i32.const 2)))
                  (f32.add
                    (f32.add
                      (f32.add
                        (f32.add
                          (f32.mul
                            (get_local 13)
                            (get_local 21))
                          (f32.const 0x0p+0 (;=0;)))
                        (f32.mul
                          (get_local 14)
                          (get_local 22)))
                      (f32.mul
                        (get_local 15)
                        (get_local 23)))
                    (f32.mul
                      (get_local 16)
                      (get_local 24))))
                (f32.store
                  (i32.add
                    (get_local 0)
                    (i32.shl
                      (i32.or
                        (get_local 3)
                        (i32.const 2))
                      (i32.const 2)))
                  (f32.add
                    (f32.add
                      (f32.add
                        (f32.add
                          (f32.mul
                            (get_local 13)
                            (get_local 25))
                          (f32.const 0x0p+0 (;=0;)))
                        (f32.mul
                          (get_local 14)
                          (get_local 26)))
                      (f32.mul
                        (get_local 15)
                        (get_local 27)))
                    (f32.mul
                      (get_local 16)
                      (get_local 28))))
                (f32.store
                  (i32.add
                    (get_local 0)
                    (i32.shl
                      (i32.or
                        (get_local 3)
                        (i32.const 3))
                      (i32.const 2)))
                  (f32.add
                    (f32.add
                      (f32.add
                        (f32.add
                          (f32.mul
                            (get_local 13)
                            (get_local 29))
                          (f32.const 0x0p+0 (;=0;)))
                        (f32.mul
                          (get_local 14)
                          (get_local 30)))
                      (f32.mul
                        (get_local 15)
                        (get_local 31)))
                    (f32.mul
                      (get_local 16)
                      (get_local 2))))
                (br_if 0 (;@12;)
                  (i32.ne
                    (tee_local 1
                      (i32.add
                        (get_local 1)
                        (i32.const 1)))
                    (i32.const 4))))
              (br 1 (;@11;)))
            (set_local 17
              (f32.load
                (get_local 4)))
            (set_local 18
              (f32.load offset=16
                (get_local 4)))
            (set_local 19
              (f32.load offset=32
                (get_local 4)))
            (set_local 20
              (f32.load offset=48
                (get_local 4)))
            (set_local 21
              (f32.load offset=4
                (get_local 4)))
            (set_local 22
              (f32.load offset=20
                (get_local 4)))
            (set_local 23
              (f32.load offset=36
                (get_local 4)))
            (set_local 24
              (f32.load offset=52
                (get_local 4)))
            (set_local 25
              (f32.load offset=8
                (get_local 4)))
            (set_local 26
              (f32.load offset=24
                (get_local 4)))
            (set_local 27
              (f32.load offset=40
                (get_local 4)))
            (set_local 28
              (f32.load offset=56
                (get_local 4)))
            (set_local 29
              (f32.load offset=12
                (get_local 4)))
            (set_local 30
              (f32.load offset=28
                (get_local 4)))
            (set_local 31
              (f32.load offset=44
                (get_local 4)))
            (set_local 2
              (f32.load offset=60
                (get_local 4)))
            (set_local 1
              (i32.const 0))
            (loop  ;; label = @13
              (set_local 13
                (f32.load
                  (i32.add
                    (i32.add
                      (get_local 9)
                      (i32.const 8))
                    (i32.shl
                      (tee_local 3
                        (i32.shl
                          (get_local 1)
                          (i32.const 2)))
                      (i32.const 2)))))
              (f32.store
                (i32.add
                  (get_local 0)
                  (i32.shl
                    (get_local 3)
                    (i32.const 2)))
                (f32.add
                  (f32.add
                    (f32.add
                      (f32.add
                        (f32.mul
                          (get_local 13)
                          (get_local 17))
                        (f32.const 0x0p+0 (;=0;)))
                      (f32.mul
                        (tee_local 14
                          (f32.load
                            (i32.add
                              (i32.add
                                (get_local 9)
                                (i32.const 8))
                              (i32.shl
                                (i32.or
                                  (get_local 3)
                                  (i32.const 1))
                                (i32.const 2)))))
                        (get_local 18)))
                    (f32.mul
                      (tee_local 15
                        (f32.load
                          (i32.add
                            (i32.add
                              (get_local 9)
                              (i32.const 8))
                            (i32.shl
                              (i32.or
                                (get_local 3)
                                (i32.const 2))
                              (i32.const 2)))))
                      (get_local 19)))
                  (f32.mul
                    (tee_local 16
                      (f32.load
                        (i32.add
                          (i32.add
                            (get_local 9)
                            (i32.const 8))
                          (i32.shl
                            (i32.or
                              (get_local 3)
                              (i32.const 3))
                            (i32.const 2)))))
                    (get_local 20))))
              (f32.store
                (i32.add
                  (get_local 0)
                  (i32.shl
                    (i32.or
                      (get_local 3)
                      (i32.const 1))
                    (i32.const 2)))
                (f32.add
                  (f32.add
                    (f32.add
                      (f32.add
                        (f32.mul
                          (get_local 13)
                          (get_local 21))
                        (f32.const 0x0p+0 (;=0;)))
                      (f32.mul
                        (get_local 14)
                        (get_local 22)))
                    (f32.mul
                      (get_local 15)
                      (get_local 23)))
                  (f32.mul
                    (get_local 16)
                    (get_local 24))))
              (f32.store
                (i32.add
                  (get_local 0)
                  (i32.shl
                    (i32.or
                      (get_local 3)
                      (i32.const 2))
                    (i32.const 2)))
                (f32.add
                  (f32.add
                    (f32.add
                      (f32.add
                        (f32.mul
                          (get_local 13)
                          (get_local 25))
                        (f32.const 0x0p+0 (;=0;)))
                      (f32.mul
                        (get_local 14)
                        (get_local 26)))
                    (f32.mul
                      (get_local 15)
                      (get_local 27)))
                  (f32.mul
                    (get_local 16)
                    (get_local 28))))
              (f32.store
                (i32.add
                  (get_local 0)
                  (i32.shl
                    (i32.or
                      (get_local 3)
                      (i32.const 3))
                    (i32.const 2)))
                (f32.add
                  (f32.add
                    (f32.add
                      (f32.add
                        (f32.mul
                          (get_local 13)
                          (get_local 29))
                        (f32.const 0x0p+0 (;=0;)))
                      (f32.mul
                        (get_local 14)
                        (get_local 30)))
                    (f32.mul
                      (get_local 15)
                      (get_local 31)))
                  (f32.mul
                    (get_local 16)
                    (get_local 2))))
              (br_if 0 (;@13;)
                (i32.ne
                  (tee_local 1
                    (i32.add
                      (get_local 1)
                      (i32.const 1)))
                  (i32.const 4)))))
          (br 1 (;@12;)))
        (call 1
          (i32.const 2)
          (i32.const 152)
          (get_local 3)))
      (set_global 2
        (get_local 8))))
  (func (;14;) (type 3) (param i32 i32 i32 f32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32)
    (block  ;; label = @1
      (set_local 8
        (get_global 2))
      (set_global 2
        (i32.add
          (get_global 2)
          (i32.const 64)))
      (if  ;; label = @2
        (i32.eqz
          (get_local 0))
        (then
          (call 1
            (i32.const 0)
            (i32.const 178)
            (i32.const 0))
          (set_global 2
            (get_local 8))
          (return)))
      (if  ;; label = @3
        (i32.eqz
          (get_local 1))
        (then
          (call 1
            (i32.const 0)
            (i32.const 179)
            (i32.const 0))
          (set_global 2
            (get_local 8))
          (return)))
      (if  ;; label = @4
        (i32.eqz
          (get_local 2))
        (then
          (call 1
            (i32.const 0)
            (i32.const 180)
            (i32.const 0))
          (set_global 2
            (get_local 8))
          (return)))
      (if  ;; label = @5
        (i32.eqz
          (i32.load
            (tee_local 15
              (i32.add
                (get_local 2)
                (i32.const 8)))))
        (then
          (call 1
            (i32.const 0)
            (i32.const 181)
            (i32.const 0))
          (set_global 2
            (get_local 8))
          (return)))
      (if  ;; label = @6
        (i32.eqz
          (i32.load
            (get_local 2)))
        (then
          (set_global 2
            (get_local 8))
          (return)))
      (set_local 16
        (i32.add
          (get_local 2)
          (i32.const 4)))
      (set_local 17
        (i32.add
          (tee_local 4
            (get_local 8))
          (i32.const 32)))
      (set_local 18
        (i32.add
          (get_local 4)
          (i32.const 48)))
      (set_local 19
        (i32.add
          (get_local 4)
          (i32.const 4)))
      (set_local 20
        (i32.add
          (get_local 4)
          (i32.const 20)))
      (set_local 21
        (i32.add
          (get_local 4)
          (i32.const 36)))
      (set_local 22
        (i32.add
          (get_local 4)
          (i32.const 52)))
      (set_local 23
        (i32.add
          (get_local 4)
          (i32.const 8)))
      (set_local 24
        (i32.add
          (get_local 4)
          (i32.const 24)))
      (set_local 25
        (i32.add
          (get_local 4)
          (i32.const 40)))
      (set_local 26
        (i32.add
          (get_local 4)
          (i32.const 56)))
      (set_local 27
        (i32.add
          (get_local 4)
          (i32.const 12)))
      (set_local 28
        (i32.add
          (get_local 4)
          (i32.const 16)))
      (set_local 29
        (i32.add
          (get_local 4)
          (i32.const 28)))
      (set_local 30
        (i32.add
          (get_local 4)
          (i32.const 44)))
      (set_local 31
        (i32.add
          (get_local 4)
          (i32.const 60)))
      (set_local 7
        (i32.const 0))
      (loop  ;; label = @7
        (call 13
          (get_local 4)
          (get_local 1)
          (get_local 3)
          (i32.load
            (i32.add
              (i32.load
                (get_local 16))
              (i32.shl
                (get_local 7)
                (i32.const 2)))))
        (set_local 9
          (i32.load
            (get_local 15)))
        (set_local 33
          (f32.load
            (get_local 17)))
        (set_local 34
          (f32.load
            (get_local 18)))
        (set_local 35
          (f32.load
            (get_local 19)))
        (set_local 36
          (f32.load
            (get_local 20)))
        (set_local 37
          (f32.load
            (get_local 21)))
        (set_local 38
          (f32.load
            (get_local 22)))
        (set_local 39
          (f32.load
            (get_local 23)))
        (set_local 40
          (f32.load
            (get_local 24)))
        (set_local 41
          (f32.load
            (get_local 25)))
        (set_local 42
          (f32.load
            (get_local 26)))
        (set_local 43
          (f32.load
            (get_local 27)))
        (set_local 44
          (f32.load
            (get_local 4)))
        (set_local 45
          (f32.load
            (get_local 28)))
        (set_local 46
          (f32.load
            (get_local 29)))
        (set_local 47
          (f32.load
            (get_local 30)))
        (set_local 48
          (f32.load
            (get_local 31)))
        (set_local 11
          (i32.const 0))
        (loop  ;; label = @8
          (set_local 10
            (i32.add
              (i32.add
                (get_local 9)
                (i32.shl
                  (get_local 7)
                  (i32.const 6)))
              (i32.shl
                (tee_local 6
                  (i32.shl
                    (get_local 11)
                    (i32.const 2)))
                (i32.const 2))))
          (f32.store
            (tee_local 5
              (i32.add
                (i32.add
                  (get_local 0)
                  (i32.shl
                    (get_local 7)
                    (i32.const 6)))
                (i32.shl
                  (get_local 6)
                  (i32.const 2))))
            (f32.const 0x0p+0 (;=0;)))
          (f32.store
            (get_local 5)
            (tee_local 32
              (f32.add
                (f32.mul
                  (f32.load
                    (get_local 10))
                  (get_local 44))
                (f32.const 0x0p+0 (;=0;)))))
          (f32.store
            (get_local 5)
            (tee_local 32
              (f32.add
                (get_local 32)
                (f32.mul
                  (f32.load
                    (tee_local 12
                      (i32.add
                        (i32.add
                          (get_local 9)
                          (i32.shl
                            (get_local 7)
                            (i32.const 6)))
                        (i32.shl
                          (i32.or
                            (get_local 6)
                            (i32.const 1))
                          (i32.const 2)))))
                  (get_local 45)))))
          (f32.store
            (get_local 5)
            (tee_local 32
              (f32.add
                (get_local 32)
                (f32.mul
                  (f32.load
                    (tee_local 13
                      (i32.add
                        (i32.add
                          (get_local 9)
                          (i32.shl
                            (get_local 7)
                            (i32.const 6)))
                        (i32.shl
                          (i32.or
                            (get_local 6)
                            (i32.const 2))
                          (i32.const 2)))))
                  (get_local 33)))))
          (f32.store
            (get_local 5)
            (f32.add
              (get_local 32)
              (f32.mul
                (f32.load
                  (tee_local 14
                    (i32.add
                      (i32.add
                        (get_local 9)
                        (i32.shl
                          (get_local 7)
                          (i32.const 6)))
                      (i32.shl
                        (i32.or
                          (get_local 6)
                          (i32.const 3))
                        (i32.const 2)))))
                (get_local 34))))
          (f32.store
            (tee_local 5
              (i32.add
                (i32.add
                  (get_local 0)
                  (i32.shl
                    (get_local 7)
                    (i32.const 6)))
                (i32.shl
                  (i32.or
                    (get_local 6)
                    (i32.const 1))
                  (i32.const 2))))
            (f32.const 0x0p+0 (;=0;)))
          (f32.store
            (get_local 5)
            (tee_local 32
              (f32.add
                (f32.mul
                  (f32.load
                    (get_local 10))
                  (get_local 35))
                (f32.const 0x0p+0 (;=0;)))))
          (f32.store
            (get_local 5)
            (tee_local 32
              (f32.add
                (get_local 32)
                (f32.mul
                  (f32.load
                    (get_local 12))
                  (get_local 36)))))
          (f32.store
            (get_local 5)
            (tee_local 32
              (f32.add
                (get_local 32)
                (f32.mul
                  (f32.load
                    (get_local 13))
                  (get_local 37)))))
          (f32.store
            (get_local 5)
            (f32.add
              (get_local 32)
              (f32.mul
                (f32.load
                  (get_local 14))
                (get_local 38))))
          (f32.store
            (tee_local 5
              (i32.add
                (i32.add
                  (get_local 0)
                  (i32.shl
                    (get_local 7)
                    (i32.const 6)))
                (i32.shl
                  (i32.or
                    (get_local 6)
                    (i32.const 2))
                  (i32.const 2))))
            (f32.const 0x0p+0 (;=0;)))
          (f32.store
            (get_local 5)
            (tee_local 32
              (f32.add
                (f32.mul
                  (f32.load
                    (get_local 10))
                  (get_local 39))
                (f32.const 0x0p+0 (;=0;)))))
          (f32.store
            (get_local 5)
            (tee_local 32
              (f32.add
                (get_local 32)
                (f32.mul
                  (f32.load
                    (get_local 12))
                  (get_local 40)))))
          (f32.store
            (get_local 5)
            (tee_local 32
              (f32.add
                (get_local 32)
                (f32.mul
                  (f32.load
                    (get_local 13))
                  (get_local 41)))))
          (f32.store
            (get_local 5)
            (f32.add
              (get_local 32)
              (f32.mul
                (f32.load
                  (get_local 14))
                (get_local 42))))
          (f32.store
            (tee_local 6
              (i32.add
                (i32.add
                  (get_local 0)
                  (i32.shl
                    (get_local 7)
                    (i32.const 6)))
                (i32.shl
                  (i32.or
                    (get_local 6)
                    (i32.const 3))
                  (i32.const 2))))
            (f32.const 0x0p+0 (;=0;)))
          (f32.store
            (get_local 6)
            (tee_local 32
              (f32.add
                (f32.mul
                  (f32.load
                    (get_local 10))
                  (get_local 43))
                (f32.const 0x0p+0 (;=0;)))))
          (f32.store
            (get_local 6)
            (tee_local 32
              (f32.add
                (get_local 32)
                (f32.mul
                  (f32.load
                    (get_local 12))
                  (get_local 46)))))
          (f32.store
            (get_local 6)
            (tee_local 32
              (f32.add
                (get_local 32)
                (f32.mul
                  (f32.load
                    (get_local 13))
                  (get_local 47)))))
          (f32.store
            (get_local 6)
            (f32.add
              (get_local 32)
              (f32.mul
                (f32.load
                  (get_local 14))
                (get_local 48))))
          (br_if 0 (;@8;)
            (i32.ne
              (tee_local 11
                (i32.add
                  (get_local 11)
                  (i32.const 1)))
              (i32.const 4))))
        (br_if 0 (;@8;)
          (i32.lt_u
            (tee_local 7
              (i32.add
                (get_local 7)
                (i32.const 1)))
            (i32.load
              (get_local 2)))))
      (set_global 2
        (get_local 8))))
  (func (;15;) (type 10) (param i32 i32 i32 i32 f32 f32 f32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32 f32)
    (block  ;; label = @1
      (set_local 13
        (get_global 2))
      (set_global 2
        (i32.add
          (get_global 2)
          (i32.const 256)))
      (if  ;; label = @2
        (i32.eqz
          (i32.load
            (get_local 3)))
        (then
          (set_global 2
            (get_local 13))
          (return)))
      (set_local 14
        (i32.add
          (get_local 13)
          (i32.const 64)))
      (set_local 15
        (get_local 13))
      (set_local 16
        (i32.add
          (get_local 3)
          (i32.const 4)))
      (set_local 17
        (i32.add
          (get_local 3)
          (i32.const 8)))
      (set_local 68
        (f32.sub
          (f32.const 0x1p+0 (;=1;))
          (get_local 6)))
      (set_local 18
        (i32.add
          (tee_local 7
            (i32.add
              (get_local 13)
              (i32.const 192)))
          (i32.const 16)))
      (set_local 19
        (i32.add
          (get_local 7)
          (i32.const 32)))
      (set_local 20
        (i32.add
          (get_local 7)
          (i32.const 48)))
      (set_local 21
        (i32.add
          (get_local 7)
          (i32.const 4)))
      (set_local 22
        (i32.add
          (get_local 7)
          (i32.const 20)))
      (set_local 23
        (i32.add
          (get_local 7)
          (i32.const 36)))
      (set_local 24
        (i32.add
          (get_local 7)
          (i32.const 52)))
      (set_local 25
        (i32.add
          (get_local 7)
          (i32.const 8)))
      (set_local 26
        (i32.add
          (get_local 7)
          (i32.const 24)))
      (set_local 27
        (i32.add
          (get_local 7)
          (i32.const 40)))
      (set_local 28
        (i32.add
          (get_local 7)
          (i32.const 56)))
      (set_local 29
        (i32.add
          (get_local 7)
          (i32.const 12)))
      (set_local 30
        (i32.add
          (get_local 7)
          (i32.const 28)))
      (set_local 31
        (i32.add
          (get_local 7)
          (i32.const 44)))
      (set_local 32
        (i32.add
          (get_local 7)
          (i32.const 60)))
      (set_local 33
        (i32.add
          (tee_local 8
            (i32.add
              (get_local 13)
              (i32.const 128)))
          (i32.const 16)))
      (set_local 34
        (i32.add
          (get_local 8)
          (i32.const 32)))
      (set_local 35
        (i32.add
          (get_local 8)
          (i32.const 48)))
      (set_local 36
        (i32.add
          (get_local 8)
          (i32.const 4)))
      (set_local 37
        (i32.add
          (get_local 8)
          (i32.const 20)))
      (set_local 38
        (i32.add
          (get_local 8)
          (i32.const 36)))
      (set_local 39
        (i32.add
          (get_local 8)
          (i32.const 52)))
      (set_local 40
        (i32.add
          (get_local 8)
          (i32.const 8)))
      (set_local 41
        (i32.add
          (get_local 8)
          (i32.const 24)))
      (set_local 42
        (i32.add
          (get_local 8)
          (i32.const 40)))
      (set_local 43
        (i32.add
          (get_local 8)
          (i32.const 56)))
      (set_local 44
        (i32.add
          (get_local 8)
          (i32.const 12)))
      (set_local 45
        (i32.add
          (get_local 8)
          (i32.const 28)))
      (set_local 46
        (i32.add
          (get_local 8)
          (i32.const 44)))
      (set_local 47
        (i32.add
          (get_local 8)
          (i32.const 60)))
      (set_local 10
        (i32.const 0))
      (loop  ;; label = @3
        (call 13
          (get_local 7)
          (get_local 1)
          (get_local 4)
          (i32.load
            (i32.add
              (i32.load
                (get_local 16))
              (i32.shl
                (get_local 10)
                (i32.const 2)))))
        (call 13
          (get_local 8)
          (get_local 2)
          (get_local 5)
          (i32.load
            (i32.add
              (i32.load
                (get_local 16))
              (i32.shl
                (get_local 10)
                (i32.const 2)))))
        (set_local 12
          (i32.load
            (get_local 17)))
        (set_local 52
          (f32.load
            (get_local 7)))
        (set_local 53
          (f32.load
            (get_local 18)))
        (set_local 54
          (f32.load
            (get_local 19)))
        (set_local 55
          (f32.load
            (get_local 20)))
        (set_local 56
          (f32.load
            (get_local 21)))
        (set_local 57
          (f32.load
            (get_local 22)))
        (set_local 58
          (f32.load
            (get_local 23)))
        (set_local 59
          (f32.load
            (get_local 24)))
        (set_local 60
          (f32.load
            (get_local 25)))
        (set_local 61
          (f32.load
            (get_local 26)))
        (set_local 62
          (f32.load
            (get_local 27)))
        (set_local 63
          (f32.load
            (get_local 28)))
        (set_local 64
          (f32.load
            (get_local 29)))
        (set_local 65
          (f32.load
            (get_local 30)))
        (set_local 66
          (f32.load
            (get_local 31)))
        (set_local 67
          (f32.load
            (get_local 32)))
        (set_local 11
          (i32.const 0))
        (loop  ;; label = @4
          (set_local 48
            (f32.load
              (i32.add
                (i32.add
                  (get_local 12)
                  (i32.shl
                    (get_local 10)
                    (i32.const 6)))
                (i32.shl
                  (tee_local 9
                    (i32.shl
                      (get_local 11)
                      (i32.const 2)))
                  (i32.const 2)))))
          (f32.store
            (i32.add
              (get_local 14)
              (i32.shl
                (get_local 9)
                (i32.const 2)))
            (f32.add
              (f32.add
                (f32.add
                  (f32.add
                    (f32.mul
                      (get_local 48)
                      (get_local 52))
                    (f32.const 0x0p+0 (;=0;)))
                  (f32.mul
                    (tee_local 49
                      (f32.load
                        (i32.add
                          (i32.add
                            (get_local 12)
                            (i32.shl
                              (get_local 10)
                              (i32.const 6)))
                          (i32.shl
                            (i32.or
                              (get_local 9)
                              (i32.const 1))
                            (i32.const 2)))))
                    (get_local 53)))
                (f32.mul
                  (tee_local 50
                    (f32.load
                      (i32.add
                        (i32.add
                          (get_local 12)
                          (i32.shl
                            (get_local 10)
                            (i32.const 6)))
                        (i32.shl
                          (i32.or
                            (get_local 9)
                            (i32.const 2))
                          (i32.const 2)))))
                  (get_local 54)))
              (f32.mul
                (tee_local 51
                  (f32.load
                    (i32.add
                      (i32.add
                        (get_local 12)
                        (i32.shl
                          (get_local 10)
                          (i32.const 6)))
                      (i32.shl
                        (i32.or
                          (get_local 9)
                          (i32.const 3))
                        (i32.const 2)))))
                (get_local 55))))
          (f32.store
            (i32.add
              (get_local 14)
              (i32.shl
                (i32.or
                  (get_local 9)
                  (i32.const 1))
                (i32.const 2)))
            (f32.add
              (f32.add
                (f32.add
                  (f32.add
                    (f32.mul
                      (get_local 48)
                      (get_local 56))
                    (f32.const 0x0p+0 (;=0;)))
                  (f32.mul
                    (get_local 49)
                    (get_local 57)))
                (f32.mul
                  (get_local 50)
                  (get_local 58)))
              (f32.mul
                (get_local 51)
                (get_local 59))))
          (f32.store
            (i32.add
              (get_local 14)
              (i32.shl
                (i32.or
                  (get_local 9)
                  (i32.const 2))
                (i32.const 2)))
            (f32.add
              (f32.add
                (f32.add
                  (f32.add
                    (f32.mul
                      (get_local 48)
                      (get_local 60))
                    (f32.const 0x0p+0 (;=0;)))
                  (f32.mul
                    (get_local 49)
                    (get_local 61)))
                (f32.mul
                  (get_local 50)
                  (get_local 62)))
              (f32.mul
                (get_local 51)
                (get_local 63))))
          (f32.store
            (i32.add
              (get_local 14)
              (i32.shl
                (i32.or
                  (get_local 9)
                  (i32.const 3))
                (i32.const 2)))
            (f32.add
              (f32.add
                (f32.add
                  (f32.add
                    (f32.mul
                      (get_local 48)
                      (get_local 64))
                    (f32.const 0x0p+0 (;=0;)))
                  (f32.mul
                    (get_local 49)
                    (get_local 65)))
                (f32.mul
                  (get_local 50)
                  (get_local 66)))
              (f32.mul
                (get_local 51)
                (get_local 67))))
          (br_if 0 (;@4;)
            (i32.ne
              (tee_local 11
                (i32.add
                  (get_local 11)
                  (i32.const 1)))
              (i32.const 4))))
        (set_local 12
          (i32.load
            (get_local 17)))
        (set_local 52
          (f32.load
            (get_local 8)))
        (set_local 53
          (f32.load
            (get_local 33)))
        (set_local 54
          (f32.load
            (get_local 34)))
        (set_local 55
          (f32.load
            (get_local 35)))
        (set_local 56
          (f32.load
            (get_local 36)))
        (set_local 57
          (f32.load
            (get_local 37)))
        (set_local 58
          (f32.load
            (get_local 38)))
        (set_local 59
          (f32.load
            (get_local 39)))
        (set_local 60
          (f32.load
            (get_local 40)))
        (set_local 61
          (f32.load
            (get_local 41)))
        (set_local 62
          (f32.load
            (get_local 42)))
        (set_local 63
          (f32.load
            (get_local 43)))
        (set_local 64
          (f32.load
            (get_local 44)))
        (set_local 65
          (f32.load
            (get_local 45)))
        (set_local 66
          (f32.load
            (get_local 46)))
        (set_local 67
          (f32.load
            (get_local 47)))
        (set_local 11
          (i32.const 0))
        (loop  ;; label = @5
          (set_local 48
            (f32.load
              (i32.add
                (i32.add
                  (get_local 12)
                  (i32.shl
                    (get_local 10)
                    (i32.const 6)))
                (i32.shl
                  (tee_local 9
                    (i32.shl
                      (get_local 11)
                      (i32.const 2)))
                  (i32.const 2)))))
          (f32.store
            (i32.add
              (get_local 15)
              (i32.shl
                (get_local 9)
                (i32.const 2)))
            (f32.add
              (f32.add
                (f32.add
                  (f32.add
                    (f32.mul
                      (get_local 48)
                      (get_local 52))
                    (f32.const 0x0p+0 (;=0;)))
                  (f32.mul
                    (tee_local 49
                      (f32.load
                        (i32.add
                          (i32.add
                            (get_local 12)
                            (i32.shl
                              (get_local 10)
                              (i32.const 6)))
                          (i32.shl
                            (i32.or
                              (get_local 9)
                              (i32.const 1))
                            (i32.const 2)))))
                    (get_local 53)))
                (f32.mul
                  (tee_local 50
                    (f32.load
                      (i32.add
                        (i32.add
                          (get_local 12)
                          (i32.shl
                            (get_local 10)
                            (i32.const 6)))
                        (i32.shl
                          (i32.or
                            (get_local 9)
                            (i32.const 2))
                          (i32.const 2)))))
                  (get_local 54)))
              (f32.mul
                (tee_local 51
                  (f32.load
                    (i32.add
                      (i32.add
                        (get_local 12)
                        (i32.shl
                          (get_local 10)
                          (i32.const 6)))
                      (i32.shl
                        (i32.or
                          (get_local 9)
                          (i32.const 3))
                        (i32.const 2)))))
                (get_local 55))))
          (f32.store
            (i32.add
              (get_local 15)
              (i32.shl
                (i32.or
                  (get_local 9)
                  (i32.const 1))
                (i32.const 2)))
            (f32.add
              (f32.add
                (f32.add
                  (f32.add
                    (f32.mul
                      (get_local 48)
                      (get_local 56))
                    (f32.const 0x0p+0 (;=0;)))
                  (f32.mul
                    (get_local 49)
                    (get_local 57)))
                (f32.mul
                  (get_local 50)
                  (get_local 58)))
              (f32.mul
                (get_local 51)
                (get_local 59))))
          (f32.store
            (i32.add
              (get_local 15)
              (i32.shl
                (i32.or
                  (get_local 9)
                  (i32.const 2))
                (i32.const 2)))
            (f32.add
              (f32.add
                (f32.add
                  (f32.add
                    (f32.mul
                      (get_local 48)
                      (get_local 60))
                    (f32.const 0x0p+0 (;=0;)))
                  (f32.mul
                    (get_local 49)
                    (get_local 61)))
                (f32.mul
                  (get_local 50)
                  (get_local 62)))
              (f32.mul
                (get_local 51)
                (get_local 63))))
          (f32.store
            (i32.add
              (get_local 15)
              (i32.shl
                (i32.or
                  (get_local 9)
                  (i32.const 3))
                (i32.const 2)))
            (f32.add
              (f32.add
                (f32.add
                  (f32.add
                    (f32.mul
                      (get_local 48)
                      (get_local 64))
                    (f32.const 0x0p+0 (;=0;)))
                  (f32.mul
                    (get_local 49)
                    (get_local 65)))
                (f32.mul
                  (get_local 50)
                  (get_local 66)))
              (f32.mul
                (get_local 51)
                (get_local 67))))
          (br_if 0 (;@5;)
            (i32.ne
              (tee_local 11
                (i32.add
                  (get_local 11)
                  (i32.const 1)))
              (i32.const 4)))
          (set_local 11
            (i32.const 0)))
        (loop  ;; label = @6
          (f32.store
            (i32.add
              (i32.add
                (get_local 0)
                (i32.shl
                  (get_local 10)
                  (i32.const 6)))
              (i32.shl
                (get_local 11)
                (i32.const 2)))
            (f32.add
              (f32.mul
                (get_local 68)
                (f32.load
                  (i32.add
                    (get_local 14)
                    (i32.shl
                      (get_local 11)
                      (i32.const 2)))))
              (f32.mul
                (f32.load
                  (i32.add
                    (get_local 15)
                    (i32.shl
                      (get_local 11)
                      (i32.const 2))))
                (get_local 6))))
          (br_if 0 (;@6;)
            (i32.ne
              (tee_local 11
                (i32.add
                  (get_local 11)
                  (i32.const 1)))
              (i32.const 16))))
        (br_if 0 (;@6;)
          (i32.lt_u
            (tee_local 10
              (i32.add
                (get_local 10)
                (i32.const 1)))
            (i32.load
              (get_local 3)))))
      (set_global 2
        (get_local 13))))
  (func (;16;) (type 11)
    (nop))
  (func (;17;) (type 11)
    (block  ;; label = @1
      (set_global 2
        (get_global 0))
      (set_global 3
        (i32.add
          (get_global 2)
          (i32.const 5242880)))
      (call 16)))
  (func (;18;) (type 12) (param i32 i32 i32 f64)
    (call 14
      (get_local 0)
      (get_local 1)
      (get_local 2)
      (f32.demote/f64
        (get_local 3))))
  (func (;19;) (type 13) (param i32 i32 i32 i32 f64 f64 f64)
    (call 15
      (get_local 0)
      (get_local 1)
      (get_local 2)
      (get_local 3)
      (f32.demote/f64
        (get_local 4))
      (f32.demote/f64
        (get_local 5))
      (f32.demote/f64
        (get_local 6))))
  (func (;20;) (type 14) (param f64 f64 f64) (result f64)
    (f64.promote/f32
      (call 5
        (f32.demote/f64
          (get_local 0))
        (f32.demote/f64
          (get_local 1))
        (f32.demote/f64
          (get_local 2)))))
  (func (;21;) (type 15) (param i32 i32 f64 i32)
    (call 13
      (get_local 0)
      (get_local 1)
      (f32.demote/f64
        (get_local 2))
      (get_local 3)))
  (func (;22;) (type 12) (param i32 i32 i32 f64)
    (call 4
      (get_local 0)
      (get_local 1)
      (get_local 2)
      (f32.demote/f64
        (get_local 3))))
  (func (;23;) (type 16) (param i32 i32 f64)
    (call 12
      (get_local 0)
      (get_local 1)
      (f32.demote/f64
        (get_local 2))))
  (func (;24;) (type 12) (param i32 i32 i32 f64)
    (call 6
      (get_local 0)
      (get_local 1)
      (get_local 2)
      (f32.demote/f64
        (get_local 3))))
  (func $_getI32AddCountLo (type 17) (result i32) 
    (return (i32.wrap/i64 (get_global 4))))
  (func $_getI32AndCountLo (type 17) (result i32)
    (return (i32.wrap/i64 (get_global 5))))
  (func $_getI32ShlCountLo (type 17) (result i32)
    (return (i32.wrap/i64 (get_global 6))))
  (func $_getI32ShruCountLo (type 17) (result i32)
    (return (i32.wrap/i64 (get_global 7))))
  (func $_getI32XorCountLo (type 17) (result i32)
    (return (i32.wrap/i64 (get_global 8))))
  (func $_getI32AddCountHi (type 17) (result i32)
    (return (i32.wrap/i64 (i64.div_s (get_global 4) (i64.const 4294967296)))))
  (func $_getI32AndCountHi (type 17) (result i32)
    (return (i32.wrap/i64 (i64.div_s (get_global 5) (i64.const 4294967296)))))
  (func $_getI32ShlCountHi (type 17) (result i32) 
    (return (i32.wrap/i64 (i64.div_s (get_global 6) (i64.const 4294967296)))))
  (func $_getI32ShruCountHi (type 17) (result i32) 
    (return (i32.wrap/i64 (i64.div_s (get_global 7) (i64.const 4294967296)))))
  (func $_getI32XorCountHi (type 17) (result i32) 
    (return (i32.wrap/i64 (i64.div_s (get_global 8) (i64.const 4294967296)))))
  (func $_resetInstCounters (type 11) 
    (set_global 4 (i64.const 0))
	(set_global 5 (i64.const 0))
	(set_global 6 (i64.const 0))
	(set_global 7 (i64.const 0))
	(set_global 8 (i64.const 0)))
  (global (;2;) (mut i32) (i32.const 0))
  (global (;3;) (mut i32) (i32.const 0))
  (global (;4;) (mut i64) (i64.const 0))
  (global (;5;) (mut i64) (i64.const 0))
  (global (;6;) (mut i64) (i64.const 0))
  (global (;7;) (mut i64) (i64.const 0))
  (global (;8;) (mut i64) (i64.const 0))
  (export "_getI32AddCountLo" (func $_getI32AddCountLo))
  (export "_getI32AndCountLo" (func $_getI32AndCountLo))
  (export "_getI32ShlCountLo" (func $_getI32ShlCountLo))
  (export "_getI32ShruCountLo" (func $_getI32ShruCountLo))
  (export "_getI32XorCountLo" (func $_getI32XorCountLo))
  (export "_getI32AddCountHi" (func $_getI32AddCountHi))
  (export "_getI32AndCountHi" (func $_getI32AndCountHi))
  (export "_getI32ShlCountHi" (func $_getI32ShlCountHi))
  (export "_getI32ShruCountHi" (func $_getI32ShruCountHi))
  (export "_getI32XorCountHi" (func $_getI32XorCountHi))
  (export "_resetInstCounters" (func $_resetInstCounters))
  (export "__Z27setRotationTranslationScaleR4Mat4RK4QuatRK4Vec3S6_" (func 7))
  (export "__post_instantiate" (func 17))
  (export "runPostSets" (func 16))
  (export "_getSingleAnimation" (func 18))
  (export "_getBlendedAnimation" (func 19))
  (export "__Z5flerpfff" (func 20))
  (export "__Z13getStaticBoneR10StaticBoneRK9Animationj" (func 10))
  (export "__Z15getAnimatedBoneR12AnimatedBoneRK9Animationj" (func 11))
  (export "__Z5m4mulR4Mat4RKS_S2_" (func 9))
  (export "__Z24getAnimatedNodeTransformR4Mat4RK9Animationfj" (func 21))
  (export "__Z5vlerpR4Vec3RKS_S2_f" (func 22))
  (export "__Z18getTransformAtTimeR4Mat4RK12AnimatedBonef" (func 23))
  (export "__Z11setIdentityR4Mat4" (func 8))
  (export "__Z6qslerpR4QuatRKS_S2_f" (func 24)))
