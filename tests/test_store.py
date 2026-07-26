import pytest

from taskbox.store import TaskStore


def test_add_and_list():
    store = TaskStore()
    task_id = store.add("write the article")
    assert store.pending()[0]["id"] == task_id


def test_move_changes_state():
    store = TaskStore()
    task_id = store.add("record the video")
    store.move(task_id, "done")
    assert store.pending() == []


def test_move_rejects_unknown_state():
    store = TaskStore()
    task_id = store.add("edit the shorts")
    with pytest.raises(ValueError):
        store.move(task_id, "finished")


def test_persistence_roundtrip(tmp_path):
    path = tmp_path / "tasks.json"
    store = TaskStore(path)
    store.add("publish")
    reloaded = TaskStore(path)
    assert reloaded.pending()[0]["title"] == "publish"
