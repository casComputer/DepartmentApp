
export const classesStrength = async()=> {
  await turso.execute(`
    -- When student becomes verified (0 → 1)
    CREATE TRIGGER IF NOT EXISTS trg_student_verify_update
    AFTER UPDATE OF is_verified ON students
    WHEN OLD.is_verified = 0 AND NEW.is_verified = 1
    BEGIN
      UPDATE classes
      SET strength = strength + 1
      WHERE course = NEW.course
        AND year = NEW.year_of_study;
    END;
  `);

  await turso.execute(`
    -- When student becomes unverified (1 → 0)
    CREATE TRIGGER IF NOT EXISTS trg_student_unverify_update
    AFTER UPDATE OF is_verified ON students
    WHEN OLD.is_verified = 1 AND NEW.is_verified = 0
    BEGIN
      UPDATE classes
      SET strength = strength - 1
      WHERE course = NEW.course
        AND year = NEW.year_of_study;
    END;
  `);

  await turso.execute(`
    -- When verified student is deleted
    CREATE TRIGGER IF NOT EXISTS trg_student_delete_verified
    AFTER DELETE ON students
    WHEN OLD.is_verified = 1
    BEGIN
      UPDATE classes
      SET strength = strength - 1
      WHERE course = OLD.course
        AND year = OLD.year_of_study;
    END;
  `);

}